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
  shortLabel: string;
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
  { key: "totalHardness", label: "Total Hardness", shortLabel: "TH", description: "Calcium Hardness", unit: "ppm", scale: [0, 200, 400, 600, 800, 1000], good: [175, 225], ideal: [190, 210], danger: [50, 500] },
  { key: "totalChlorine", label: "Total Chlorine", shortLabel: "TC", description: "Combined + Free Chlorine", unit: "ppm", scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], good: [1, 4], ideal: [2, 3], danger: [0.5, 8] },
  { key: "freeChlorine", label: "Free Chlorine", shortLabel: "FC", description: "Active sanitizer (hypochlorous acid)", unit: "ppm", scale: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], good: [1, 4], ideal: [2, 3], danger: [0.5, 8] },
  { key: "ph", label: "pH", shortLabel: "pH", description: "Acidity / basicity", unit: "", scale: [6.2, 6.6, 7.0, 7.4, 7.8, 8.2], good: [7.2, 7.5], ideal: [7.3, 7.5], danger: [6.8, 7.8] },
  { key: "alkalinity", label: "Total Alkalinity", shortLabel: "TA", description: "pH buffer capacity", unit: "ppm", scale: [0, 40, 80, 120, 160, 200, 240], good: [125, 150], ideal: [130, 140], danger: [40, 200] },
  { key: "stabilizer", label: "Stabilizer", shortLabel: "CYA", description: "Cyanuric Acid (CYA) — UV protection", unit: "ppm", scale: [0, 50, 100, 150, 200, 250, 300], good: [30, 150], ideal: [40, 80], danger: [15, 200] },
];

// ─── Time-Since Tracker Thresholds ────────────────────────────────

export interface TrackerDef {
  key: string;
  label: string;
  yellowDays: number;
  redDays: number;
}

export const DEFAULT_TRACKERS: TrackerDef[] = [
  { key: "saltTest", label: "Salt test", yellowDays: 3, redDays: 7 },
  { key: "chemicalTest", label: "Chemical test", yellowDays: 3, redDays: 7 },
  { key: "filterChange", label: "Filter change", yellowDays: 30, redDays: 90 },
  { key: "saltCellCleaning", label: "Salt cell cleaning", yellowDays: 60, redDays: 90 },
  { key: "backwash", label: "Backwash", yellowDays: 7, redDays: 14 },
];

// ─── Saltwater System LED Readings ────────────────────────────────
// From Intex Krystal Clear CG-26667 manual

export type LedCategory = "mode" | "timer" | "alarm";

export interface ErrorCode {
  code: string;
  category: LedCategory;
  meaning: string;
  fix?: string;
}

export const ERROR_CODES: ErrorCode[] = [
  // Modes
  { code: "80", category: "mode", meaning: "Boost Mode", fix: "Temporarily increases chlorine output. Runs until manually stopped or timer expires." },
  { code: "00", category: "mode", meaning: "Stand-By Mode (Start-up)", fix: "System is powered on and waiting. Press the timer button to begin a cycle." },
  { code: "93", category: "mode", meaning: "Stand-By Mode (Cycle finished)", fix: "Operating process finished. System is idle until the next scheduled cycle." },
  { code: "BLANK", category: "mode", meaning: "No Power / Power Saving Mode", fix: "No power to the unit, or the system is in power-saving mode waiting to start the next cycle." },
  // Timer (operating hours remaining)
  { code: "01", category: "timer", meaning: "1 hour remaining" },
  { code: "02", category: "timer", meaning: "2 hours remaining" },
  { code: "03", category: "timer", meaning: "3 hours remaining" },
  { code: "04", category: "timer", meaning: "4 hours remaining" },
  { code: "05", category: "timer", meaning: "5 hours remaining" },
  { code: "06", category: "timer", meaning: "6 hours remaining" },
  { code: "07", category: "timer", meaning: "7 hours remaining" },
  { code: "08", category: "timer", meaning: "8 hours remaining" },
  { code: "09", category: "timer", meaning: "9 hours remaining" },
  { code: "10", category: "timer", meaning: "10 hours remaining" },
  { code: "11", category: "timer", meaning: "11 hours remaining" },
  { code: "12", category: "timer", meaning: "12 hours remaining (maximum)" },
  // Alarms
  { code: "90", category: "alarm", meaning: "Low Pump Flow / No Flow", fix: "Check that the pump is running and all valves are open. Clean the filter cartridge. Ensure hoses are not kinked or blocked." },
  { code: "91", category: "alarm", meaning: "Low Salt Level", fix: "Add pool-grade salt to reach 2700–3400 ppm. Run pump for 24 hrs to dissolve, then retest." },
  { code: "92", category: "alarm", meaning: "High Salt Level", fix: "Partially drain pool and refill with fresh water. Retest after circulation." },
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
  description: string;
  options: string[];
};

export function getRecommendations(
  readings: Partial<Record<MetricKey, number>>,
): Recommendation[] {
  const recs: Recommendation[] = [];

  const ph = readings.ph;
  if (ph !== undefined) {
    if (ph < 7.2) {
      recs.push({ metric: "pH", status: "low", description: "pH is low — water is acidic", options: ["Soda ash (sodium carbonate)", "pH increaser", "Aeration to off-gas CO₂"] });
    }
    if (ph > 7.5) {
      recs.push({ metric: "pH", status: "high", description: "pH is high — water is basic", options: ["Muriatic acid", "pH decreaser (sodium bisulfate)", "CO₂ injection"] });
    }
  }

  const alk = readings.alkalinity;
  if (alk !== undefined) {
    if (alk < 125) {
      recs.push({ metric: "Total Alkalinity", status: "low", description: "Alkalinity is low — pH will be unstable", options: ["Baking soda (sodium bicarbonate)", "Alkalinity increaser"] });
    }
    if (alk > 150) {
      recs.push({ metric: "Total Alkalinity", status: "high", description: "Alkalinity is high — pH will drift up", options: ["Muriatic acid", "pH decreaser", "pH cycling with aeration"] });
    }
  }

  const stabilizer = readings.stabilizer;
  if (stabilizer !== undefined) {
    if (stabilizer < 30) {
      recs.push({ metric: "Stabilizer (CYA)", status: "low", description: "CYA is low — chlorine will burn off quickly in sunlight", options: ["Cyanuric acid (stabilizer/conditioner)", "Stabilized chlorine tablets (dichlor/trichlor)"] });
    }
    if (stabilizer > 150) {
      recs.push({ metric: "Stabilizer (CYA)", status: "high", description: "CYA is high — chlorine effectiveness is reduced", options: ["Partial drain and refill with fresh water", "Reduce use of stabilized chlorine"] });
    }
  }

  const hardness = readings.totalHardness;
  if (hardness !== undefined) {
    if (hardness < 175) {
      recs.push({ metric: "Total Hardness", status: "low", description: "Calcium is low — water may be corrosive", options: ["Calcium chloride", "Calcium hardness increaser"] });
    }
    if (hardness > 225) {
      recs.push({ metric: "Total Hardness", status: "high", description: "Calcium is high — risk of scale buildup", options: ["Partial drain and refill with fresh water", "Scale inhibitor/sequestrant"] });
    }
  }

  const fc = readings.freeChlorine;
  if (fc !== undefined) {
    if (fc < 1) {
      recs.push({ metric: "Free Chlorine", status: "low", description: "Free chlorine is low — sanitization is insufficient", options: ["Liquid chlorine (sodium hypochlorite)", "Increase salt generator output", "Shock treatment"] });
    }
    if (fc > 4) {
      recs.push({ metric: "Free Chlorine", status: "high", description: "Free chlorine is high — may irritate skin/eyes", options: ["Reduce salt generator output", "Wait for UV and usage to lower it", "Sodium thiosulfate (chlorine neutralizer)"] });
    }
  }

  return recs;
}
