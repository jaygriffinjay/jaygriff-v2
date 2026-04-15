// ─── Pool Profile ─────────────────────────────────────────────────
// Intex Prism Frame 14ft x 42in above-ground pool
// Krystal Clear cartridge filter pump (1,000 GPH)
// Intex Krystal Clear saltwater system (model CG-26667)

export const POOL = {
  name: "Intex Prism Frame",
  shape: "round" as const,
  diameter: "14ft",
  height: "42in",
  gallons: 3357,
  pump: "Krystal Clear Cartridge Filter (1,000 GPH)",
  saltSystem: "Intex Krystal Clear CG-26667",
} as const;

// ─── Water Chemistry — Test Strip Scales ──────────────────────────

export type MetricKey =
  | "totalHardness"
  | "totalChlorine"
  | "freeChlorine"
  | "ph"
  | "alkalinity"
  | "stabilizer";

export interface MetricDef {
  key: MetricKey;
  label: string;
  description: string;
  unit: string;
  /** Scale points printed on the test strip */
  scale: number[];
  /** Good (acceptable) range [min, max] */
  good: [number, number];
  /** Ideal sweet-spot range [min, max] */
  ideal: [number, number];
  /** Danger thresholds — outside this is "very low" / "very high" */
  danger: [number, number];
}

export const METRICS: MetricDef[] = [
  { key: "totalHardness", label: "Total Hardness", description: "Calcium Hardness", unit: "ppm", scale: [0, 100, 250, 500, 1000], good: [175, 225], ideal: [190, 210], danger: [50, 500] },
  { key: "totalChlorine", label: "Total Chlorine", description: "Combined + Free Chlorine", unit: "ppm", scale: [0, 1, 3, 5, 10], good: [1, 4], ideal: [2, 3], danger: [0.5, 8] },
  { key: "freeChlorine", label: "Free Chlorine", description: "Active sanitizer (hypochlorous acid)", unit: "ppm", scale: [0, 1, 3, 5, 10], good: [1, 4], ideal: [2, 3], danger: [0.5, 8] },
  { key: "ph", label: "pH", description: "Acidity / basicity", unit: "", scale: [6.2, 6.8, 7.2, 7.8, 8.4], good: [7.2, 7.5], ideal: [7.3, 7.5], danger: [6.8, 7.8] },
  { key: "alkalinity", label: "Total Alkalinity", description: "pH buffer capacity", unit: "ppm", scale: [0, 40, 120, 180, 240], good: [125, 150], ideal: [130, 140], danger: [40, 200] },
  { key: "stabilizer", label: "Stabilizer", description: "Cyanuric Acid (CYA) — UV protection", unit: "ppm", scale: [0, 50, 100, 150, 300], good: [30, 150], ideal: [40, 80], danger: [15, 200] },
];

// ─── Time-Since Tracker Thresholds ────────────────────────────────

export interface TrackerDef {
  key: string;
  label: string;
  yellowDays: number;
  redDays: number;
}

export const DEFAULT_TRACKERS: TrackerDef[] = [
  { key: "saltTest", label: "Last salt test", yellowDays: 3, redDays: 7 },
  { key: "chemicalTest", label: "Last chemical test", yellowDays: 3, redDays: 7 },
  { key: "filterChange", label: "Last filter change", yellowDays: 30, redDays: 90 },
  { key: "saltCellCleaning", label: "Last salt cell cleaning", yellowDays: 60, redDays: 90 },
  { key: "backwash", label: "Last backwash", yellowDays: 7, redDays: 14 },
];

// ─── Saltwater System Error Codes ─────────────────────────────────
// From Intex Krystal Clear CG-26667 manual

export interface ErrorCode {
  code: string;
  meaning: string;
  fix: string;
}

export const ERROR_CODES: ErrorCode[] = [
  { code: "90", meaning: "Low salt level", fix: "Add pool-grade salt to reach 2700–3400 ppm. Run pump for 24 hrs to dissolve, then retest." },
  { code: "91", meaning: "High salt level", fix: "Partially drain pool and refill with fresh water. Retest after circulation." },
  { code: "92", meaning: "Check salt system / clean cell", fix: "Inspect and clean the electrolytic cell with a mild acid solution. Rinse thoroughly before reinstalling." },
  { code: "93", meaning: "Water too cold (below 60°F)", fix: "Salt chlorination is ineffective below 60°F. Use manual chlorine dosing until water warms up." },
  { code: "94", meaning: "GFCI trip / electrical fault", fix: "Unplug the unit and check for water in electrical connections. Allow to dry before restarting. If repeated, contact Intex support." },
];

// ─── Helpers ──────────────────────────────────────────────────────

export type Status = "very-low" | "low" | "good" | "ideal" | "high" | "very-high" | "none";

export function getStatus(
  value: number | undefined,
  good: [number, number],
  ideal: [number, number],
  danger?: [number, number],
): Status {
  if (value === undefined) return "none";
  if (danger && value < danger[0]) return "very-low";
  if (value < good[0]) return "low";
  if (danger && value > danger[1]) return "very-high";
  if (value > good[1]) return "high";
  if (value >= ideal[0] && value <= ideal[1]) return "ideal";
  return "good";
}

// ─── Dosing Calculations ──────────────────────────────────────────

export type Recommendation = {
  metric: string;
  status: "low" | "high";
  action: string;
  amount: string;
};

export function getRecommendations(
  readings: Partial<Record<MetricKey, number>>,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const gal = POOL.gallons;

  const ph = readings.ph;
  if (ph !== undefined) {
    if (ph < 7.2) {
      const deficit = 7.4 - ph;
      const ozPer10k = (deficit / 0.2) * 6;
      const oz = (ozPer10k * gal) / 10000;
      recs.push({ metric: "pH", status: "low", action: "Add soda ash (sodium carbonate)", amount: `${oz.toFixed(1)} oz` });
    }
    if (ph > 7.5) {
      const excess = ph - 7.4;
      const ozPer10k = (excess / 0.2) * 12;
      const oz = (ozPer10k * gal) / 10000;
      recs.push({ metric: "pH", status: "high", action: "Add muriatic acid or pH downer", amount: `${oz.toFixed(1)} fl oz` });
    }
  }

  const alk = readings.alkalinity;
  if (alk !== undefined) {
    if (alk < 125) {
      const deficit = 137 - alk;
      const lbsPer10k = (deficit / 10) * 1.5;
      const lbs = (lbsPer10k * gal) / 10000;
      recs.push({ metric: "Total Alkalinity", status: "low", action: "Add baking soda (sodium bicarbonate)", amount: `${lbs.toFixed(1)} lbs` });
    }
    if (alk > 150) {
      const excess = alk - 137;
      const ozPer10k = (excess / 10) * 12;
      const oz = (ozPer10k * gal) / 10000;
      recs.push({ metric: "Total Alkalinity", status: "high", action: "Add muriatic acid", amount: `${oz.toFixed(1)} fl oz` });
    }
  }

  const stabilizer = readings.stabilizer;
  if (stabilizer !== undefined) {
    if (stabilizer < 30) {
      const deficit = 50 - stabilizer;
      const ozPer10k = (deficit / 10) * 13;
      const oz = (ozPer10k * gal) / 10000;
      recs.push({ metric: "Stabilizer (CYA)", status: "low", action: "Add stabilizer/conditioner", amount: `${oz.toFixed(1)} oz` });
    }
    if (stabilizer > 150) {
      recs.push({ metric: "Stabilizer (CYA)", status: "high", action: "Partially drain & refill with fresh water", amount: "Dilute until below 150 ppm" });
    }
  }

  const hardness = readings.totalHardness;
  if (hardness !== undefined) {
    if (hardness < 175) {
      const deficit = 200 - hardness;
      const lbsPer10k = (deficit / 10) * 1.25;
      const lbs = (lbsPer10k * gal) / 10000;
      recs.push({ metric: "Total Hardness", status: "low", action: "Add calcium chloride", amount: `${lbs.toFixed(1)} lbs` });
    }
    if (hardness > 225) {
      recs.push({ metric: "Total Hardness", status: "high", action: "Partially drain & refill with fresh water", amount: "Dilute until 175–225 ppm" });
    }
  }

  return recs;
}
