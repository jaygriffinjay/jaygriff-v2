"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/modules/db/turso";
import { requireAuth } from "@/app/admin/actions/auth";
import type { MetricKey } from "@/app/pool/pool-config";

// ─── Types ────────────────────────────────────────────────────────

export type TestEntry = {
  date: string;
  readings: Partial<Record<MetricKey, number>>;
};

export type TrackerTimestamps = Record<string, string>;

// ─── Reads (public) ──────────────────────────────────────────────

export async function getPoolTests(): Promise<TestEntry[]> {
  const result = await db.execute("SELECT date, readings FROM pool_tests ORDER BY date DESC");
  return result.rows.map((r) => ({
    date: r.date as string,
    readings: JSON.parse(r.readings as string),
  }));
}

export async function getPoolTrackers(): Promise<TrackerTimestamps> {
  const result = await db.execute("SELECT key, last_done FROM pool_trackers");
  const trackers: TrackerTimestamps = {};
  for (const r of result.rows) {
    trackers[r.key as string] = r.last_done as string;
  }
  return trackers;
}

// ─── Writes ──────────────────────────────────────────────────────

export async function addPoolTest(readings: Partial<Record<MetricKey, number>>): Promise<TestEntry> {
  await requireAuth();
  const date = new Date().toISOString();
  const readingsJson = JSON.stringify(readings);

  await db.execute({
    sql: "INSERT INTO pool_tests (date, readings) VALUES (?, ?)",
    args: [date, readingsJson],
  });

  // Auto-reset the chemicalTest tracker
  const chemKeys: MetricKey[] = ["totalHardness", "totalChlorine", "freeChlorine", "ph", "alkalinity", "stabilizer"];
  if (chemKeys.some((k) => readings[k] !== undefined)) {
    await db.execute({
      sql: "INSERT OR REPLACE INTO pool_trackers (key, last_done) VALUES ('chemicalTest', ?)",
      args: [date],
    });
  }

  return { date, readings };
}

export async function resetTracker(key: string): Promise<void> {
  await requireAuth();
  const now = new Date().toISOString();
  await db.execute({
    sql: "INSERT OR REPLACE INTO pool_trackers (key, last_done) VALUES (?, ?)",
    args: [key, now],
  });
}

export async function deletePoolTest(date: string): Promise<void> {
  await requireAuth();
  await db.execute({
    sql: "DELETE FROM pool_tests WHERE date = ?",
    args: [date],
  });
  revalidatePath("/pool");
  revalidatePath("/admin/pool");
}

export async function updatePoolTest(
  date: string,
  readings: Partial<Record<MetricKey, number>>,
): Promise<void> {
  await requireAuth();
  await db.execute({
    sql: "UPDATE pool_tests SET readings = ? WHERE date = ?",
    args: [JSON.stringify(readings), date],
  });
  revalidatePath("/pool");
  revalidatePath("/admin/pool");
}

export async function deleteTracker(key: string): Promise<void> {
  await requireAuth();
  await db.execute({
    sql: "DELETE FROM pool_trackers WHERE key = ?",
    args: [key],
  });
  revalidatePath("/pool");
  revalidatePath("/admin/pool");
}

export async function updateTracker(key: string, lastDone: string): Promise<void> {
  await requireAuth();
  await db.execute({
    sql: "UPDATE pool_trackers SET last_done = ? WHERE key = ?",
    args: [lastDone, key],
  });
  revalidatePath("/pool");
  revalidatePath("/admin/pool");
}
