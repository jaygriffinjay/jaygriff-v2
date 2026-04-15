# Apps Auth — Public Read / Private Write

## The Goal

All personal apps on this site (pool tracker, calorie/macro tracker, future tools) share the same pattern: **publicly viewable data, write-protected actions.** Anyone can see the dashboards and published results, but only authorized users (me + roommate) can log entries, edit, or delete.

No accounts, no OAuth, no login page — just a single shared passphrase that unlocks write access across all apps via a long-lived cookie.

---

## Current State

- **Pool tracker** lives at `/pool` with all data in `localStorage` — nothing server-persisted.
- **Turso (libSQL)** is already wired up in `src/lib/turso.ts` for the content/CMS system.
- No other apps exist yet, but a calorie/macro tracker is planned.

This means we need three things: **a shared auth layer**, **database persistence per app**, and **a `canWrite` pattern every app follows**.

---

## The Plan

### 1. Shared Auth Layer — `src/lib/app-auth.ts`

A single reusable module that every app imports. Not app-specific — one passphrase, one cookie, one unlock flow.

**Env var:** `APP_WRITE_KEY` — a single passphrase for all apps.

**Cookie:** `app_write` — `HttpOnly`, `Secure`, `SameSite=Lax`, 1-year expiry. Value is an HMAC of a known string using the passphrase as key (opaque, not reversible).

**Exports:**

| Function | Description |
|---|---|
| `unlock(passphrase)` | Server action. Validates passphrase, sets the cookie. |
| `lock()` | Server action. Clears the cookie. |
| `canWrite()` | Server-side helper. Reads the cookie, returns `boolean`. |
| `requireWrite()` | Server-side guard. Throws if cookie is missing/invalid. Use at the top of write actions. |

Every app's write actions call `requireWrite()` before executing. Every app's page calls `canWrite()` to determine what to render.

### 2. The `canWrite` UI Pattern

Every app follows the same structure:

```
/app-name/page.tsx (server component)
├── const writable = await canWrite()
├── Fetches app data via server actions (public reads)
└── Renders <AppDashboard data={...} canWrite={writable} />
```

**`canWrite={true}`** — Full UI: forms, buttons, delete, edit.
**`canWrite={false}`** — Read-only: data displays, charts, tables. No write controls rendered.

### 3. Shared Unlock Component — `src/components/app-unlock.tsx`

A small `"use client"` component any app page can drop in:

- When locked: subtle lock icon (e.g., in the page header). Click reveals a passphrase input.
- On submit: calls the `unlock()` server action → page reloads → `canWrite` is now true.
- When unlocked: shows a subtle open-lock icon. Click calls `lock()` to clear the cookie.
- Reusable across all apps — not app-specific.

### 4. Database — Per-App Tables in Turso

Each app gets its own tables. No shared "logs" table — keep apps independent.

**Pool:**

```sql
CREATE TABLE IF NOT EXISTS pool_tests (
  id        TEXT PRIMARY KEY,
  date      TEXT NOT NULL,
  readings  TEXT NOT NULL       -- JSON: { "ph": 7.2, "freeChlorine": 3, ... }
);

CREATE TABLE IF NOT EXISTS pool_trackers (
  key       TEXT PRIMARY KEY,
  last_done TEXT NOT NULL
);
```

**Calorie Tracker (future):**

```sql
CREATE TABLE IF NOT EXISTS food_log (
  id        TEXT PRIMARY KEY,
  date      TEXT NOT NULL,
  meal      TEXT NOT NULL,       -- "breakfast", "lunch", "dinner", "snack"
  item      TEXT NOT NULL,
  calories  INTEGER NOT NULL,
  protein   REAL,
  carbs     REAL,
  fat       REAL
);
```

Each app has its own server actions file (`src/actions/pool.ts`, `src/actions/food.ts`, etc.). Write actions call `requireWrite()`. Read actions are public.

### 5. Server Actions — Per App

**Pool (`src/actions/pool.ts`):**

| Action | Auth? | Description |
|---|---|---|
| `getPoolTests()` | No | All test entries, newest first |
| `getPoolTrackers()` | No | All tracker timestamps |
| `addPoolTest(entry)` | **Yes** | Insert a test log |
| `deletePoolTest(id)` | **Yes** | Delete a test entry |
| `resetTracker(key)` | **Yes** | Update tracker's `last_done` |

**Calorie (`src/actions/food.ts`) — future:**

| Action | Auth? | Description |
|---|---|---|
| `getFoodLog(date?)` | No | Entries for a date or all |
| `getDailySummary(date)` | No | Totals for a day |
| `addFoodEntry(entry)` | **Yes** | Log a food item |
| `deleteFoodEntry(id)` | **Yes** | Delete an entry |

### 6. Migration — Pool localStorage to Turso

One-time migration:

1. Dev-only "Export" button that reads localStorage and POSTs to a migration server action.
2. Or: manually copy JSON from DevTools and insert via SQL script.
3. Remove all localStorage code from the dashboard.

---

## File Structure

```
src/
  lib/
    app-auth.ts          # Shared: unlock(), lock(), canWrite(), requireWrite()
  components/
    app-unlock.tsx        # Shared: lock/unlock UI component
  actions/
    pool.ts              # Pool CRUD (reads public, writes gated)
    food.ts              # Calorie CRUD (future)
  app/
    pool/
      page.tsx           # canWrite() → <PoolDashboard canWrite={...} />
    food/                # Future
      page.tsx           # canWrite() → <FoodDashboard canWrite={...} />
```

---

## Adding a New App — The Pattern

1. **Create tables** in Turso for the app's data.
2. **Create `src/actions/app-name.ts`** — read actions (public) + write actions (call `requireWrite()`).
3. **Build the dashboard component** — accept `canWrite` prop, conditionally render write UI.
4. **Build the page** — call `canWrite()`, fetch data, pass both to the dashboard.
5. **Drop `<AppUnlock />` in the page header** — done.

No new auth code, no new env vars, no new cookies. The shared layer handles it all.

---

## What It Looks Like

**Your roommate:**
1. Opens `jaygriff.com/pool` on his phone
2. Taps the lock icon, types the passphrase you texted him
3. Cookie set for 1 year — works on `/pool`, `/food`, any future app
4. Logs tests, tracks meals, uses everything normally

**A random visitor:**
1. Opens `jaygriff.com/pool`
2. Sees the dashboard — readings, charts, status indicators
3. No forms, no buttons, no way to write
4. Can browse to `/food` and see your daily macros too — all read-only

---

## Security Notes

- **Not high-security.** This prevents random strangers from writing garbage data. That's the threat model.
- **One passphrase for all apps.** Simple. If you ever need per-app access (e.g., roommate can write to pool but not food), split into per-app env vars and cookies. But start simple.
- **HMAC cookie value** — opaque, can't be reversed to recover the passphrase.
- **HttpOnly + Secure** — not accessible to JS, not sent over plain HTTP.

---

## Open Questions

- **Public data scope per app:** Should visitors see full history (all test logs, all food entries) or just the latest/summary? Can be decided per app.
- **Tracker visibility:** Should public visitors see when maintenance was last done (read-only) or hide trackers entirely?
- **Future: per-app write keys?** Start with one shared key. Split later if needed.
