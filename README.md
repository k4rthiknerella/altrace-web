# altrace-web

The public site at https://www.altrace.io: a static homepage for Rashomon and a Teams page. No build step.

## Pages

| Path | File | |
|---|---|---|
| `/` | `site/index.html` | Rashomon: what it does today, the README's example report, how it works, install |
| `/for-teams` | `site/for-teams.html` | Team workflows in development; Calendly booking |
| 404 | `site/404.html` | |

Retired URLs from the earlier product redirect to `/` (see `site/vercel.json`).

## Deployment

Vercel, with the project's root directory set to `site/`. The deploy reads `site/vercel.json` (redirects, security headers, cache rules); the root `vercel.json` is not used.

CSS and JS under `/css` and `/js` are cached for 30 days as immutable: when you change one, bump its `?v=` query in every page that loads it.

To preview locally:

```bash
npx serve site
```

## Booking and contact

Booking buttons link to Calendly (`site/js/calendly-booking.js` opens Calendly's popup once its script has loaded, otherwise the link opens in a new tab).

`site/api/contact.js` is a Vercel function that sends a contact request by email. Configure:

- `RESEND_API_KEY` (required)
- `CONTACT_FROM_EMAIL` (optional; defaults to Resend's onboarding sender)
- `CONTACT_TO_EMAIL` (optional; defaults to `rishi@altrace.io`)

## Brand

`site/css/site.css` follows the Altrace brand guide: ink colour tokens, Geist and Geist Mono (self-hosted under `site/fonts`, OFL), 4px radius, outlined controls, a 2px accent focus ring.

## License

Apache 2.0
