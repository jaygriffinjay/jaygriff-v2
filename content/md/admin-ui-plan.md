# Admin UI Plan

## Goal

Stop manually editing the DB to publish docs. Have a simple web interface for toggling draft/published, editing metadata, and eventually moderating comments.

## Auth: Two Phases

### Phase 1 — Simple password (build this now)

- `ADMIN_PASSWORD` env var in `.env.local`
- `/admin/login` — single password input, Server Action verifies it, signs a JWT with `jose`, sets an `httpOnly` `Secure` `SameSite=Lax` cookie
- `src/middleware.ts` — reads cookie on every `/admin/*` request, verifies JWT, redirects to `/admin/login` if missing or invalid
- Only new dependency: `jose` (JWT signing/verification, small, no external service)

Good enough for toggling publish status from your laptop. Not ideal for mobile.

### Phase 2 — Passkeys (upgrade when comments land)

When comments need moderation from mobile, swap the password for a passkey via passwordless.dev (Bitwarden-backed WebAuthn). The admin UI, middleware, and JWT cookie all stay identical — only the login page changes. Full plan already documented in `admin-auth-plan.md`.

The reason to wait: passkeys require a one-time browser registration step and an external API key. Not worth the setup friction just to toggle a status field from your laptop.

## Admin Routes

```
/admin                      → redirect to /admin/content
/admin/login                → password form (client component)
/admin/content              → content list with status toggles
/admin/content/[slug]       → full metadata editor (phase 2)
```

## Files to Create

```
src/middleware.ts                     ← JWT check on /admin/*
src/app/admin/layout.tsx              ← shared admin shell + signout button
src/app/admin/login/page.tsx          ← password form
src/app/admin/content/page.tsx        ← content list + status toggles
src/actions/content.ts                ← Server Actions (toggleStatus, updateMetadata)
src/app/api/auth/signout/route.ts     ← clears session cookie
```

## Content List Page (`/admin/content`)

A table of all content rows regardless of status. Columns:

| Title | Type | Status | Created |
|---|---|---|---|
| Block Model Architecture | doc | **draft** | Apr 2 |
| Content Pipeline Deep Dive | doc | **published** | Mar 28 |

- Status cell is a clickable badge — cycles `draft → published → archived`
- Click triggers a Server Action: `UPDATE content SET status = ? WHERE id = ?`
- Server Action calls `revalidatePath('/admin/content')` + `revalidatePath('/docs')` + `revalidatePath('/posts')`
- No page reload, no separate edit page needed for the basic flow

## Server Actions (`src/actions/content.ts`)

```ts
"use server"

export async function toggleStatus(id: string, current: string) {
  const next = current === 'draft' ? 'published'
             : current === 'published' ? 'archived'
             : 'draft'

  await db.execute({
    sql: "UPDATE content SET status = ?, updated_at = ? WHERE id = ?",
    args: [next, new Date().toISOString(), id],
  })

  revalidatePath('/admin/content')
  revalidatePath('/docs')
  revalidatePath('/posts')
}
```

## Middleware (`src/middleware.ts`)

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value

  if (!token) return NextResponse.redirect(new URL('/admin/login', req.url))

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

## Env Vars to Add

```
ADMIN_PASSWORD=your-password-here
ADMIN_JWT_SECRET=a-long-random-secret-string
```

`ADMIN_JWT_SECRET` should be a long random string (32+ chars). Generate with:
```
openssl rand -base64 32
```

## Future: Comments Moderation

When comments land (post block model), the admin shell gets a second tab:

```
/admin/content    ← content list (existing)
/admin/comments   ← pending comment queue, approve/reject
```

A comment is a `comments` table row with `approved: boolean`. Pending comments show in a queue — click approve, it becomes visible on the page. Click reject, it's deleted.

This is also when Phase 2 auth (passkeys) becomes worth implementing — mobile moderation from Bitwarden is a much better experience than typing a password on your phone.

## Implementation Order

1. Install `jose`
2. Add `ADMIN_PASSWORD` + `ADMIN_JWT_SECRET` to `.env.local`
3. Build login page + login Server Action
4. Build signout route
5. Build middleware
6. Build `/admin/content` list page with status toggle
7. Test end-to-end: login → toggle a doc to published → verify it appears on `/docs`
