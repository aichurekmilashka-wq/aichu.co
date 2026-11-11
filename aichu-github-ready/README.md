# aichu.co React animation demo

React + TypeScript + Tailwind CSS + original HalftoneWordmarkFooter.

## Publish using GitHub Pages
1. Create a public GitHub repository (e.g. `aichu-demo`).
2. Upload **all contents of this directory**, including the `.github` folder, into repository root on the `main` branch.
3. In repository Settings → Pages → Build and deployment → Source, select **GitHub Actions**.
4. Open Actions and wait for **Publish React site** to finish; Settings → Pages shows the resulting URL.

No npm installation is needed on your own computer. GitHub Actions handles it.
For local development: `npm install` then `npm run dev`.

## Application form

See [APPLICATION_SETUP.md](APPLICATION_SETUP.md) to connect direct delivery or test the email fallback. Run `npm test` for validation and delivery-response checks; the tests do not send real applications.
