create table public.leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  phone text not null check (phone ~ '^\+[1-9][0-9]{6,14}$'),
  team_size integer not null check (team_size between 1 and 1000000),
  language text not null check (language in ('ru','en','ky')),
  consent_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','contacted','closed'))
);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant all on public.leads to service_role;
create table public.lead_limits (
  bucket text not null,
  window_start timestamptz not null,
  count integer not null,
  primary key (bucket, window_start)
);
alter table public.lead_limits enable row level security;
revoke all on public.lead_limits from anon, authenticated;
grant all on public.lead_limits to service_role;
create function public.receive_lead(p_id uuid, p_name text, p_phone text, p_team integer, p_language text, p_ip_hash text)
returns text language plpgsql security invoker set search_path = '' as $$
declare h timestamptz := date_trunc('hour',now()); d timestamptz := date_trunc('day',now());
begin
  -- Serialize the short admission transaction: retries cannot bypass quotas.
  perform pg_advisory_xact_lock(91827461);
  if exists(select 1 from public.leads where id=p_id) then return 'accepted'; end if;
  delete from public.lead_limits where window_start < now()-interval '2 days';
  if coalesce((select count from public.lead_limits where bucket='global' and window_start=h),0)>=200
     or coalesce((select count from public.lead_limits where bucket='ip:'||p_ip_hash and window_start=h),0)>=5
     or coalesce((select count from public.lead_limits where bucket='phone:'||md5(p_phone) and window_start=d),0)>=3 then
    return 'limited';
  end if;
  insert into public.leads(id,name,phone,team_size,language) values(p_id,p_name,p_phone,p_team,p_language);
  insert into public.lead_limits values('global',h,1),('ip:'||p_ip_hash,h,1),('phone:'||md5(p_phone),d,1)
    on conflict(bucket,window_start) do update set count=public.lead_limits.count+1;
  return 'accepted';
end;
$$;
revoke all on function public.receive_lead(uuid,text,text,integer,text,text) from public, anon, authenticated;
grant execute on function public.receive_lead(uuid,text,text,integer,text,text) to service_role;
