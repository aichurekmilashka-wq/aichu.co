const allowedOrigins = new Set(['https://aichuuu.com', 'https://www.aichuuu.com']);
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('origin') || '';
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'Vary': 'Origin',
    'Access-Control-Allow-Origin': allowedOrigins.has(origin) ? origin : 'https://aichuuu.com',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
  const reply = (status: number, success = false) => new Response(JSON.stringify({ success }), { status, headers });
  if (!allowedOrigins.has(origin)) return reply(403);
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (req.method !== 'POST') return reply(405);
  if (!req.headers.get('content-type')?.startsWith('application/json')) return reply(415);
  try {
    const reader = req.body?.getReader();
    if (!reader) return reply(400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return reply(413); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const body = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== 'object' || body.botcheck || body.consent !== true) return reply(400);
    const { id, name, phone, teamSize, language } = body;
    if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
      || typeof name !== 'string' || !name.trim() || name.length > 120 || /[\x00-\x1f<>]/.test(name)
      || typeof phone !== 'string' || !/^\+[1-9]\d{6,14}$/.test(phone)
      || !Number.isInteger(teamSize) || teamSize < 1 || teamSize > 1000000 || !['ru','en','ky'].includes(language)) return reply(400);
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const url = Deno.env.get('SUPABASE_URL');
    if (!secret || !url) return reply(503);
    // Store only a rotating keyed hash for temporary throttling, never the raw IP.
    const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',').at(-1)!.trim();
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${secret}:${new Date().toISOString().slice(0,10)}:${ip}`));
    const ipHash = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2,'0')).join('');
    const response = await fetch(`${url}/rest/v1/rpc/receive_lead`, { method: 'POST',
      headers: { apikey: secret, Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_id: id, p_name: name.trim(), p_phone: phone, p_team: teamSize, p_language: language, p_ip_hash: ipHash }),
      signal: AbortSignal.timeout(10000) });
    if (!response.ok) return reply(503);
    const result = await response.json();
    return result === 'accepted' ? reply(200, true) : result === 'limited' ? reply(429) : reply(503);
  } catch { return reply(400); }
});
