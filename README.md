# Altrace Web Console

Management console and marketing site for the Altrace governance platform. 24 HTML pages (16 authenticated console pages, 8 public pages). Built with vanilla JavaScript -- no framework dependencies.

## Console Pages (Authenticated)

| Page | Path | Description |
|---|---|---|
| Dashboard | `/dashboard.html` | Overview of fleet status, active kill switches, budget utilization |
| Kill Switches | `/kill-switches.html` | Activate/deactivate global, team, and agent kill switches |
| Approvals | `/approvals.html` | Pending human-in-the-loop approval requests |
| Fleet | `/fleet.html` | Connected agent inventory and health |
| Cost & Budget | `/cost.html` | Team and agent spending, budget limits, usage history |
| Audit Log | `/audit.html` | Tamper-evident audit trail with hash chain verification |
| Metrics | `/metrics.html` | Prometheus metric visualization |
| Policies | `/policies.html` | Content governance, tool permissions, taint flow rules |
| Credentials | `/virtualkeys.html` | VirtualKey issuance, listing, and revocation |
| Teams & RBAC | `/teams.html` | Team management and role-based access control |
| Compliance | `/compliance.html` | Framework mapping (SOC 2, ISO 42001, EU AI Act, NIST AI RMF) |
| Settings | `/settings.html` | System configuration and proxy settings |
| Console Docs | `/console-docs.html` | Inline documentation for console features |
| Login | `/login.html` | Authentication |
| Setup | `/setup.html` | Initial configuration wizard |

## Public Pages

| Page | Path | Description |
|---|---|---|
| Home | `/index.html` | Landing page |
| Product | `/product.html` | Product overview and capabilities |
| Why Altrace | `/why-altrace.html` | Value proposition and differentiators |
| Pricing | `/pricing.html` | Pricing tiers |
| Request Access | `/request-access.html` | Access request form |
| Demo | `/demo.html` | Interactive demonstration |
| Compliance | `/compliance-public.html` | Public compliance and certification status |
| 404 | `/404.html` | Not found |

## Architecture

- **No build step.** Static HTML, CSS, and JavaScript served directly.
- **Shared infrastructure.** `site/js/console.js` provides sidebar navigation, SSE streaming, toast notifications, auto-refresh, and dark mode for all authenticated pages.
- **Authentication.** `site/js/auth.js` handles session management and token-based authentication.
- **Styling.** `site/css/` contains shared stylesheets.

## Directory Structure

```
site/
  css/         Stylesheets
  js/
    auth.js    Authentication and session management
    console.js Sidebar, SSE stream, toasts, auto-refresh
    main.js    Public page scripts
  assets/      Static assets
  *.html       Page files
```

## Deployment

### Nginx

An `nginx.conf` is provided in the repository root. It serves the `site/` directory with appropriate caching and security headers.

```bash
docker-compose up
```

### Vercel

A `vercel.json` is provided for Vercel deployment. The site is configured for static hosting with security response headers.

### Manual

Serve the `site/` directory with any static file server:

```bash
npx serve site
```

## Console Navigation

The sidebar organizes pages into four sections:

- **Command** -- Dashboard, Kill Switches, Approvals
- **Observe** -- Fleet, Cost & Budget, Audit Log, Metrics
- **Govern** -- Policies, Credentials, Teams & RBAC
- **Comply** -- Compliance

## License

Apache 2.0
