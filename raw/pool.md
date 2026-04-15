# Pool Maintenance App — Design Document

## Overview

A single-user web app for tracking and maintaining an above-ground saltwater pool.

---

## Pool Profile (Hardcoded)

Pool dimensions, volume, gallons, and equipment details will be defined as a constant in code. No settings UI needed. Values TBD from owner:

- **Shape**: round / oval / rectangular
- **Dimensions**: TBD
- **Volume (gallons)**: TBD
- **Saltwater system make/model**: TBD

---

## Features

### 1. Dashboard

The main screen. Shows at a glance:

- **Current readings** from the most recent test log entry, with visual indicators (low / ideal / high) for each metric
- **"Time since" counters** for key maintenance events (see section 3)
- **Prescriptive actions** — if any readings are out of range, show what to do and how much chemical to add (calculated from pool volume)

### 2. Test Log

Record water test results over time.

**Tracked metrics:**

| Metric              | Unit | Ideal Range   |
| ------------------- | ---- | ------------- |
| pH                  | —    | 7.2 – 7.6    |
| Free Chlorine       | ppm  | 1 – 3        |
| Total Chlorine      | ppm  | 1 – 3        |
| Salt                | ppm  | 2700 – 3400  |
| Total Alkalinity    | ppm  | 80 – 120     |
| Cyanuric Acid (CYA) | ppm  | 30 – 50      |
| Calcium Hardness    | ppm  | 200 – 400    |

**Functionality:**

- Add new test entry (date auto-filled, editable)
- View history as a table (newest first)
- Adding an entry auto-updates the "last water test" timer
- Optional: simple sparkline or trend indicator per metric

### 3. Time-Since Trackers

Elapsed-time displays showing how long ago key maintenance tasks were performed. Color-coded: green → yellow → red as time increases.

**Default tracked events:**

| Event                  | Yellow threshold | Red threshold |
| ---------------------- | ---------------- | ------------- |
| Last water test        | 3 days           | 7 days        |
| Last filter change     | 30 days          | 90 days       |
| Last salt cell cleaning | 60 days          | 90 days       |
| Last pump basket check | 7 days           | 14 days       |
| Last backwash          | 7 days           | 14 days       |

- User can mark an event as "done now" (resets the timer)
- User can add custom trackable events
- Stored as timestamps in `localStorage`

### 4. Prescriptive Calculator

Given the latest test results + hardcoded pool volume, calculate specific dosing recommendations.

**Covers:**

- **pH too low** → add soda ash (sodium carbonate) — amount based on gallons + current pH
- **pH too high** → add muriatic acid or dry acid — amount based on gallons + current pH
- **Salt too low** → add pool salt — lbs needed based on gallons + current vs. target ppm
- **Salt too high** → dilution guidance (partial drain & refill)
- **Alkalinity too low** → add baking soda — amount based on gallons + current TA
- **Alkalinity too high** → add muriatic acid
- **CYA too low** → add stabilizer/conditioner
- **CYA too high** → dilution guidance
- **Calcium hardness** → adjust or note
- **Shock dosing** → how much shock to add based on gallons

Recommendations displayed inline on the dashboard when readings are out of range, and also accessible as a standalone calculator page.

### 5. Reference

Static reference content, always accessible.

#### 5a. Ideal Ranges Cheat Sheet

Quick-glance table of all metrics and their ideal ranges.

#### 5b. Saltwater System Error Codes

Lookup table of error codes + troubleshooting steps for the owner's specific saltwater chlorine generator. (Make/model TBD — will populate with correct codes.)

#### 5c. Chemical Safety & Interactions

- Never add acid and chlorine at the same time
- Always add chemicals to water, not water to chemicals
- Run pump when adding chemicals
- Other key warnings

#### 5d. Explainers

Short "what is this and why does it matter" for each metric:

- pH, Free Chlorine, Total Chlorine, Salt, Alkalinity, CYA, Calcium Hardness

### 6. Seasonal Checklists (Static)

Non-interactive reference lists for seasonal tasks.

- **Opening** — steps to open the pool for the season
- **Mid-Season** — ongoing maintenance reminders
- **Closing / Winterizing** — steps to shut down for winter

---

1. **Dashboard** — readings, time-since, actions
2. **Log** — test history + add entry
3. **Reference** — error codes, ranges, guides, checklists

Calculator is inline on dashboard + optionally a standalone page.

---

## Data Model (localStorage)

```ts
// Test log entry
interface TestEntry {
  id: string;          // nanoid or crypto.randomUUID()
  date: string;        // ISO date string
  ph?: number;
  freeChlorine?: number;
  totalChlorine?: number;
  salt?: number;
  alkalinity?: number;
  cya?: number;
  calciumHardness?: number;
  notes?: string;
}

// Maintenance event timestamp
interface MaintenanceEvent {
  id: string;
  label: string;
  lastPerformed: string; // ISO date string
  yellowDays: number;    // days until yellow warning
  redDays: number;       // days until red warning
  isCustom?: boolean;
}

// All persisted data
interface PoolData {
  testLog: TestEntry[];
  maintenanceEvents: MaintenanceEvent[];
}
```

---

## Tech Stack

- **Next.js** (App Router) — already set up
- **shadcn/ui** — already installed, use for all UI components
- **localStorage** — persistence, no backend
- **Tailwind CSS** — styling (already configured)

---

## Open Questions

- [ ] Pool dimensions, volume, and gallons
- [ ] Saltwater system make/model (for error codes)
