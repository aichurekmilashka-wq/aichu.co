# aichuuu.co account sign-in

The React app uses Supabase Auth for real email/password accounts. GitHub Pages is static, so accounts and password hashes must live in an external authentication service. No passwords are stored in this repository.

## Activation

1. Create a Supabase project and enable **Authentication → Providers → Email** with email confirmation enabled.
2. In **Authentication → URL Configuration**, set the Site URL to the actual canonical site, currently `https://aichuuu.com/`. Add exact redirect URLs for each live locale:
   - `https://aichuuu.com/ru/`
   - `https://aichuuu.com/en/`
   - `https://aichuuu.com/ky/`
   - If still using the GitHub Pages demo, also allow:
     - `https://aichurekmilashka-wq.github.io/aichu.co/ru/`
     - `https://aichurekmilashka-wq.github.io/aichu.co/en/`
     - `https://aichurekmilashka-wq.github.io/aichu.co/ky/`
3. Copy **Project URL** and the **publishable key** (or legacy public anon key) from Supabase project settings into GitHub repository **Settings → Secrets and variables → Actions → Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Re-run **Publish React site** in GitHub Actions (or push a new commit).
5. Test registration, email confirmation, sign in, sign out, recovery link and password change in all three languages.

For local development, create `.env.local` from `.env.example` and add the same public values. Never commit a service-role key or private token. Vite's `VITE_*` variables are intentionally embedded in browser code.

## Before accepting real customers

- Set up a production email/SMTP sender in Supabase; hosted default email sending has limits.
- Configure rate limits/CAPTCHA as appropriate and publish a real privacy policy describing account data processing.
- Add row-level security (RLS) for **every future table** containing user or company data, and enforce organization membership and roles server-side. Showing a logged-in React component is **not** authorization.
- The current account modal shows only the signed-in email; a REZON workspace and private data access have **not** been built.

If variables have not been configured, the account icon opens an explicit not-yet-connected state. It never pretends a user is logged in.
