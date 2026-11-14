# aichu.co React animation demo

React + TypeScript + Tailwind CSS + original HalftoneWordmarkFooter.

## Publish using GitHub Pages
1. Create a public GitHub repository (e.g. `aichu-demo`).
2. Upload **all contents of this directory**, including the `.github` folder, into repository root on the `main` branch.
3. In repository Settings → Pages → Build and deployment → Source, select **GitHub Actions**.
4. Open Actions and wait for **Publish React site** to finish; Settings → Pages shows the resulting URL.

No npm installation is needed on your own computer. GitHub Actions handles it.
For local development: `npm ci --ignore-scripts` then `npm run dev`. Development and preview servers bind to localhost by default; use an explicit `--host` override only when LAN access is needed.

## Application form

See [APPLICATION_SETUP.md](APPLICATION_SETUP.md) to connect direct delivery or test the email fallback. Run `npm test` for validation and delivery-response checks; the tests do not send real applications.

## Security checks

Dependencies are locked in `package-lock.json`; both workflows use `npm ci --ignore-scripts` and pin their direct GitHub Actions to full commit SHAs. Browser tooling is a locked development dependency rather than an extra install of the latest release.

After `npm run build`, run `npm run security:check` to check generated pages for unsafe script policies and known credential patterns. `npm audit --audit-level=high` checks runtime and build dependencies. The deployment workflow blocks publication when these checks fail. These checks do not replace access controls on GitHub, the domain registrar or analytics accounts.


## Live application collection

Forms submit to the `submit-lead` Supabase Edge Function in the `aichuuu-leads` project (`kbnhwitwttcemvysbeco`). Requests contain name, international phone, team size, language, explicit consent and a retry UUID. Only a successful database transaction produces the success UI. Email remains a manual fallback after errors; it is not an automatic notification.

View requests in the authenticated Supabase dashboard → Table Editor → `public.leads`; newest requests sort by `created_at` descending. Export CSV there if needed. No visitor or ordinary authenticated application user can read or update records: table grants are revoked and RLS has no permissive policies. Only the server-side receiver and project administrators access records. Never expose the service-role key. The browser's legacy anon JWT is public and only permits invoking the rate-limited function.

Receiver source and schema are in `/supabase/`. Gateway JWT validation stays enabled. Allowed browser origins are `https://aichuuu.com` and `https://www.aichuuu.com`; preview origins are deliberately excluded. CORS is not bot authentication. Server checks types, sizes, consent and honeypot; SQL atomically enforces a maximum of 5 submissions per hashed IP/hour, 3 per phone/day and 200 total/hour. Duplicate UUID retries do not create duplicate records. The IP hash is salted by the server secret and current day; raw IP is not stored in the lead table. Temporary limiter entries are pruned on submissions. These controls reduce abuse but do not replace a CAPTCHA against distributed bots.

Project is on the organization free plan; quotas and inactivity rules apply. No email/Telegram notifications are configured. Handle data access/deletion and retention in this private project.
