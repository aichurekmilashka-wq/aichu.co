# Application collection

The live site saves applications to the private Supabase project `aichuuu-leads` (`kbnhwitwttcemvysbeco`), through the JWT-gated `submit-lead` Edge Function. No Web3Forms variable or mail app is required for ordinary submission.

## View applications

Sign into the owning Supabase account: https://supabase.com/dashboard/project/kbnhwitwttcemvysbeco/editor

Open `public.leads` and sort `created_at` descending. Fields: name, phone, team_size, language, created_at, consent_at, status. CSV export is available in the dashboard. Three initial rows named `QA TEST — delete me`, with the reserved fictional number `+12025550199`, are synthetic backend verification records, not customers.

## Security and maintenance

The browser's public anon JWT invokes the receiver but cannot read or write tables directly. `anon` and `authenticated` have no lead-table privileges. Server-only service-role credentials remain in Supabase runtime secrets. Do not copy them into the website or VITE variables.

Source: `supabase/functions/submit-lead/index.ts`; deployed schema: `supabase/leads.sql`. Changes to those repository files do not automatically redeploy Supabase. Deploy the receiver and schema separately through an authorized Supabase connection. Website deployments remain on GitHub Pages.

Success appears only after database persistence. A UUID prevents duplicate retries. Server limits: 5/IP/hour, 3/phone/day, 200 overall/hour; origin allowlist, consent, body-size and field checks, honeypot. Limits reduce abuse; CORS and a public JWT are not bot identity checks.

No email or Telegram notifications are configured. On failure the visitor can explicitly use the email draft fallback. Monitor the private inbox and manage data retention/deletion there. The project is on the free plan, subject to provider quotas and inactivity rules.
