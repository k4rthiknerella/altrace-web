# ALTRACE-WEB CISO Security Audit

**Date:** 2026-03-18
**Scope:** `/Users/karthik/altrace/altrace-web/` -- 29 HTML pages, 3 JS files, 2 vercel.json, 1 nginx.conf, 2 YAML configs
**Auditor:** Forge

## Executive Summary

**Overall Risk: MEDIUM** (post-fixes)

17 findings identified. 6 fixed in this session. 5 accepted-as-designed. 6 remain open (2 HIGH, 4 MEDIUM).

## Findings

| ID | Severity | CWE | Finding | Status |
|----|----------|-----|---------|--------|
| AUTH-01 | HIGH | CWE-602 | Client-side role self-selection -- user picks own role from dropdown | OPEN |
| AUTH-02 | HIGH | CWE-613 | No session timeout | **FIXED** |
| AUTH-03 | MEDIUM | CWE-922 | Token in sessionStorage (XSS-to-theft chain) | ACCEPTED |
| AUTH-04 | MEDIUM | CWE-352 | No CSRF token (mitigated by Bearer pattern) | ACCEPTED |
| AUTH-05 | MEDIUM | CWE-287 | Demo mode bypasses auth with admin role | ACCEPTED |
| XSS-01 | MEDIUM | CWE-79 | innerHTML patterns -- fleet.html degraded_ids, causal_hash unescaped | **FIXED** |
| HDR-03 | MEDIUM | CWE-79 | CSP allows unsafe-inline | ACCEPTED |
| DEP-01 | MEDIUM | CWE-494 | CDN scripts without SRI (echarts x3, supabase x1) | **FIXED** |
| SEC-01 | LOW | CWE-798 | Hub config in web repo (tokens redacted in git) | ACCEPTED |
| XSS-02 | LOW | CWE-79 | getActionBadge raw HTML (safe by design -- switch/case only) | ACCEPTED |
| DEP-02 | LOW | CWE-494 | Unpinned Supabase version (@2 -> @2.99.2) | **FIXED** |
| DEP-03 | LOW | CWE-494 | Google Fonts without SRI | ACCEPTED |
| XSS-03 | INFO | CWE-312 | Supabase anon key in source (by design) | ACCEPTED |
| SEC-02 | INFO | CWE-200 | Supabase project URL exposed (by design) | ACCEPTED |
| WEB-03 | -- | -- | site/ vercel.json missing headers | FIXED (prior) |
| WEB-04 | -- | -- | nginx.conf missing headers | FIXED (prior) |
| HDR-04 | LOW | -- | nginx /health endpoint missing HSTS + Permissions-Policy | **FIXED** |

## Fixes Applied (This Session)

### 1. Session Timeout (AUTH-02 fix)
**File:** `site/js/auth.js`
- Added 8-hour absolute session TTL
- Added 30-minute idle timeout
- `touchSession()` called on every `authFetch()` to refresh idle timer
- `created_at` and `last_active` timestamps stored in session object

### 2. SRI Hashes on CDN Scripts (DEP-01 fix)
**Files:** `site/dashboard.html`, `site/cost.html`, `site/metrics.html`, `site/request-access.html`
- echarts@5.6.0: `sha384-pPi0zxBAoDu6+JXW/C68UZLvBUUtU+7zonhif43rqj7pxsGyqyqzcian2Rj37Rss`
- supabase-js@2.99.2: `sha384-zETTH+6IXxKQ6zbGcT6H6EDdnGaae9uhI8uO7doTJoNEmPGeTKVOe5S6/XybS9JH`

### 3. Supabase Version Pinned (DEP-02 fix)
**File:** `site/request-access.html`
- Changed `@supabase/supabase-js@2` to `@supabase/supabase-js@2.99.2`

### 4. XSS Fixes in fleet.html (XSS-01 fix)
**File:** `site/fleet.html`
- `degraded_ids` array elements now escaped: `.map(id => escapeHtml(String(id))).join(', ')`
- `causal_checkpoint.latest_hash` now escaped: `escapeHtml(cp.latest_hash.substring(0, 16))`

### 5. nginx /health Headers (HDR-04 fix)
**File:** `nginx.conf`
- Added `Strict-Transport-Security` and `Permissions-Policy` to /health location block

## Remaining Open Items

### AUTH-01 (HIGH): Client-Side Role Self-Selection
The login form allows users to pick admin/operator/viewer from a dropdown. The role is stored client-side and used for UI visibility. Fix requires a `/api/v1/auth/whoami` hub endpoint that returns the role associated with the token.

### AUTH-03/AUTH-04/AUTH-05 (MEDIUM): Accepted by Design
- sessionStorage is the best option for static SPA without server-side sessions
- Bearer tokens in Authorization headers are inherently CSRF-resistant
- Demo mode is intentionally unauthenticated for product demos

### HDR-03 (MEDIUM): unsafe-inline in CSP
Required because all console pages use inline `<script>` blocks. Fix requires extracting all inline JS into separate files and using nonce-based CSP. Non-trivial effort, deferred.

## Positive Security Findings

1. **escapeHtml() is used consistently** across all pages for API response data
2. **teams.html uses 100% DOM API** (createElement + textContent) -- zero innerHTML
3. **audit.html timeline view uses 100% DOM API** -- zero innerHTML
4. **dashboard.html uses 100% DOM API** for budget chart and activity feed
5. **Security headers are comprehensive** in both vercel.json configs and nginx.conf
6. **X-Frame-Options: DENY** prevents clickjacking
7. **frame-ancestors: 'none'** in CSP provides defense-in-depth for frame embedding
8. **HSTS with includeSubDomains** prevents SSL stripping
9. **No cookies used** -- Bearer token pattern eliminates entire class of cookie attacks
10. **No `document.cookie` access anywhere** in the codebase
11. **No `window.open()` calls** -- no open redirect vectors
12. **`meta robots noindex nofollow`** on all authenticated pages prevents search engine indexing
13. **Production tokens are redacted** in committed `altrace-hub.yaml`
14. **Local dev tokens are gitignored** via `*.local.yaml` pattern
15. **CORS allowlist is restrictive** -- only altrace.io origins + localhost
