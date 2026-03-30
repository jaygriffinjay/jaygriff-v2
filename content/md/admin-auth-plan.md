# Admin UI + Passkey Auth Plan

The goal: a local admin interface for managing site content (editing titles, descriptions, tags, publishing/unpublishing) — protected by a passkey via passwordless.dev (Bitwarden's WebAuthn service).

## Why passwordless.dev

- Bitwarden-backed, free up to 10k users, trustworthy
- Handles the WebAuthn ceremony so we never touch `navigator.credentials` directly
- Passkeys are stored in Bitwarden - same workflow as everything else
- Right-sized for a personal site: no Clerk overhead, no OAuth dance, no passwords to manage

## Auth Stack

- **passwordless.dev** — WebAuthn registration + assertion
- **`@passwordlessdev/passwordless-client`** — browser-side SDK (triggers passkey prompt)
- **`jose`** — sign and verify a JWT stored in an `httpOnly` cookie
- **Next.js middleware** — protect all `/admin/*` routes at the edge

## Flow

### One-time registration (localhost only)

1. Hit `/admin/register` (disabled in production)
2. Server calls passwordless.dev API → gets a registration token
3. Client SDK uses that token to trigger the browser passkey creation prompt
4. Passkey saved in Bitwarden
5. Done — never do this again

### Sign in

1. Hit `/admin/login`
2. Client SDK triggers passkey assertion (Bitwarden prompt)
3. Server verifies the assertion token with passwordless.dev API
4. Server signs a JWT (`jose`) and sets it as an `httpOnly` `Secure` cookie
5. Middleware reads cookie on every `/admin/*` request — valid JWT = through, missing/invalid = redirect to `/admin/login`

### Sign out

Delete the session cookie.

## Routes

```
/admin                    → redirect to /admin/content
/admin/login              → passkey sign-in page (client component)
/admin/register           → one-time passkey registration (disabled in prod)
/admin/content            → list all content rows (draft + published + archived)
/admin/content/[slug]     → edit title, description, type, status, tags, etc.
```

## Admin UI

The content editor at `/admin/content/[slug]` needs to update fields in Turso directly — no sync script, no file changes. Fields editable from the UI:

- `title`
- `description`
- `status` (draft → published → archived)
- `tags`
- `type`
- `thumbnail`
- `feature`
- `authorship_note`

Save triggers a Server Action that runs an UPDATE query against Turso. No page reload required.

## Security Notes

- Registration route disabled (404) when `NODE_ENV === "production"`
- Session JWT signed with a secret from env (`ADMIN_JWT_SECRET`) — rotate to invalidate all sessions
- Cookie is `httpOnly`, `Secure`, `SameSite=Lax`
- Middleware runs at the edge — unauthenticated requests never reach page code

## Implementation Order

1. Install `@passwordlessdev/passwordless-client` and `jose`
2. Add env vars: `PASSWORDLESS_API_KEY`, `PASSWORDLESS_API_SECRET`, `ADMIN_JWT_SECRET`
3. Build `/admin/login` (client component, calls SDK)
4. Build Route Handlers: `/api/auth/signin/token`, `/api/auth/signin/verify`, `/api/auth/signout`
5. Build middleware for `/admin/*`
6. Build registration flow (localhost only)
7. Build `/admin/content` listing page
8. Build `/admin/content/[slug]` editor with Server Action save
