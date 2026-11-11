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
