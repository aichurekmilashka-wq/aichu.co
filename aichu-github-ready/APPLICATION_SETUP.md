# Application delivery

The form has two explicit modes:

- With `VITE_WEB3FORMS_ACCESS_KEY`: POST to Web3Forms, confirm success only when the response is successful and contains `success: true`. Requests time out after 20 seconds. Errors keep the form data and offer an email draft.
- Without the key: the button says “Prepare email”. The visitor sends the prepared draft from their own mail app. A selectable draft and copy button remain available when no mail app opens. This mode never displays an automatic-delivery confirmation.

## Connect direct delivery

1. Obtain a Web3Forms form access key for the intended notification email. The email owner must complete any verification required by that service.
2. Set the repository **Actions variable** `VITE_WEB3FORMS_ACCESS_KEY`. The existing Pages workflow passes it to Vite. For local development, set it in `.env.local` instead.
3. Rebuild/deploy the site. Vite reads this value at build time; setting the variable alone does not change an existing deployment.

This is a public form key embedded in browser JavaScript. Do not put an email password, mail API secret, or Supabase service role key in a `VITE_*` variable. The form sends contact data to Web3Forms only after the visitor submits it; the privacy text links to that service when connected.

## Validation

Phone numbers require `+`, a nonzero first country-code digit and 7–15 digits in total. Spaces, brackets, dots and hyphens are accepted for readability and removed before delivery. This validates format, not ownership or whether a number is reachable. Names must contain non-whitespace text; team size must be an integer from 1 to 1,000,000.

## Checks without delivering real applications

`npm test` checks normalization, malformed numbers, URL encoding of the email draft, explicit API success, HTTP and JSON failures, network errors and request timeout with mocked requests. `npm run build` checks TypeScript and generates localized pages.

For browser testing, intercept `https://api.web3forms.com/submit` and return controlled responses; never send test contact data to the live service. Check RU/EN/KY, both themes, keyboard validation, the clipboard-denied case, and small-screen scrolling. Real inbox delivery requires a separately authorized submission and is not established by mocked tests.
