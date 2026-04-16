"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { H2, H3, Paragraph, Bold, Small } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import {
  METRICS,
  DEFAULT_TRACKERS,
  ERROR_CODES,
  getRecommendations,
  getStatus,
  type MetricKey,
  type Recommendation,
} from "./pool-config";
import {
  addPoolTest,
  resetTracker,
  type TestEntry,
  type TrackerTimestamps,
} from "@/actions/pool";
import styles from "./pool.module.css";

// ─── Helpers ──────────────────────────────────────────────────────

function formatValue(key: MetricKey, value: number): string {
  return key === "ph" ? value.toFixed(1) : String(Math.round(value));
}

const STATUS_COLORS = {
  "very-low": "oklch(0.577 0.245 27.325)",
  low: "oklch(0.704 0.191 22.216)",
  good: "oklch(0.765 0.177 163.223)",
  ideal: "oklch(0.596 0.145 163.225)",
  high: "oklch(0.704 0.191 22.216)",
  "very-high": "oklch(0.577 0.245 27.325)",
  none: "oklch(0.556 0 0)",
} as const;

function buildGradient(m: { scale: number[]; danger: [number, number]; good: [number, number]; ideal: [number, number] }): string {
  const min = m.scale[0];
  const max = m.scale[m.scale.length - 1];
  const pct = (v: number) => `${(((Math.max(min, Math.min(max, v)) - min) / (max - min)) * 100).toFixed(1)}%`;
  const mid = (a: number, b: number) => (a + b) / 2;

  const c = STATUS_COLORS;
  return `linear-gradient(to right, ${c["very-low"]} 0%, ${c.low} ${pct(mid(m.danger[0], m.good[0]))}, ${c.good} ${pct(mid(m.good[0], m.ideal[0]))}, ${c.ideal} ${pct(mid(m.ideal[0], m.ideal[1]))}, ${c.good} ${pct(mid(m.ideal[1], m.good[1]))}, ${c.low} ${pct(mid(m.good[1], m.danger[1]))}, ${c["very-high"]} 100%)`;
}

function daysSince(iso: string | undefined): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / 86400000);
}

function formatElapsed(iso: string | undefined): string {
  const days = daysSince(iso);
  if (days === null) return "Never";
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

// ─── Component ────────────────────────────────────────────────────

interface PoolDashboardProps {
  initialTests: TestEntry[];
  initialTrackers: TrackerTimestamps;
}

export function PoolDashboard({ initialTests, initialTrackers }: PoolDashboardProps) {
  const [tests, setTests] = useState<TestEntry[]>(initialTests);
  const [trackers, setTrackers] = useState<TrackerTimestamps>(initialTrackers);

  const latestReadings = tests[0]?.readings ?? {};
  const recs = getRecommendations(latestReadings);

  // ─── Test Log handlers ────────────────────────────────────────

  const addTestEntry = useCallback(
    async (readings: Partial<Record<MetricKey, number>>) => {
      const entry = await addPoolTest(readings);
      setTests((prev) => [entry, ...prev]);
      // If chemical keys were tested, update tracker optimistically
      const chemKeys: MetricKey[] = [
        "totalHardness",
        "totalChlorine",
        "freeChlorine",
        "ph",
        "alkalinity",
        "stabilizer",
      ];
      if (chemKeys.some((k) => readings[k] !== undefined)) {
        setTrackers((prev) => ({ ...prev, chemicalTest: entry.date }));
      }
    },
    [],
  );

  const markTrackerDone = useCallback(
    async (key: string) => {
      const now = new Date().toISOString();
      setTrackers((prev) => ({ ...prev, [key]: now }));
      await resetTracker(key);
    },
    [],
  );

  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="log">Test Log</TabsTrigger>
        <TabsTrigger value="reference">Reference</TabsTrigger>
      </TabsList>

      {/* ═══ Dashboard Tab ═══ */}
      <TabsContent value="dashboard" className={styles.tabSection}>
        {/* Current Readings */}
        <div className="flex items-center gap-3">
          <H2>Current Readings</H2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setActiveTab("log")}
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {tests.length === 0 ? (
          <Paragraph className={styles.emptyState}>
            No test entries yet. Add one in the Test Log tab.
          </Paragraph>
        ) : (
          <>
            <Card>
              <CardContent className="divide-y py-0">
                <Small className="block py-3 text-muted-foreground">
                  Last tested{" "}
                  {new Date(tests[0].date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </Small>
                {METRICS.map((m) => {
                  const val = latestReadings[m.key];
                  const status = getStatus(val, m.good, m.ideal, m.danger);
                  return (
                    <div
                      key={m.key}
                      className={styles.readingRow}
                    >
                      <div className={styles.readingCardRow}>
                        <span className={styles.metricLabel}>{m.label}</span>
                        <span
                          className={styles.readingValue}
                          style={{ color: STATUS_COLORS[status as keyof typeof STATUS_COLORS] }}
                        >
                          {val !== undefined ? formatValue(m.key, val) : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </>
        )}

        {/* Maintenance Trackers */}
        <Separator className="my-4" />
        <div className="flex items-center gap-3">
          <H2>Maintenance</H2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {DEFAULT_TRACKERS.map((t) => (
                <DropdownMenuItem
                  key={t.key}
                  onClick={() => markTrackerDone(t.key)}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Card>
          <CardContent className="divide-y">
            {DEFAULT_TRACKERS.map((t) => {
              const ts = trackers[t.key];
              const days = daysSince(ts);
              const color =
                days === null || days >= t.redDays
                  ? styles.trackerRed
                  : days >= t.yellowDays
                    ? styles.trackerYellow
                    : styles.trackerGreen;
              return (
                <div key={t.key} className={styles.trackerRow}>
                  <span className={styles.trackerLabel}>{t.label}</span>
                  <span className={cn(styles.trackerElapsed, color)}>
                    {formatElapsed(ts)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      {/* ═══ Test Log Tab ═══ */}
      <TabsContent value="log" className={styles.tabSection}>
        <H2>Log Test Results</H2>
        <TestEntryForm onSubmit={addTestEntry} />
        <Separator className="my-6" />
        {tests.length === 0 ? (
          <Paragraph className={styles.emptyState}>No entries yet.</Paragraph>
        ) : (
          <div className={styles.historyTableWrap}>
            <Table className={styles.historyTable}>
              <TableHeader>
                <TableRow>
                  <TableHead className={styles.historyDateCol}>Date</TableHead>
                  {METRICS.map((m) => (
                    <TableHead key={m.key} className={styles.historyMetricCol}>
                      {m.shortLabel}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((entry) => (
                  <TableRow key={entry.date}>
                    <TableCell className={styles.historyDateCol}>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    {METRICS.map((m) => {
                      const val = entry.readings[m.key];
                      const status = getStatus(val, m.good, m.ideal, m.danger);
                      return (
                        <TableCell
                          key={m.key}
                          className={styles.historyMetricCol}
                          style={{
                            color: val !== undefined
                              ? STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                              : undefined,
                          }}
                        >
                          {val !== undefined ? formatValue(m.key, val) : "—"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </TabsContent>

      {/* ═══ Reference Tab ═══ */}
      <TabsContent value="reference" className={styles.tabSection}>
        <Paragraph className="text-muted-foreground">
          <a href="https://intexcorp.com/above-ground-pools/prism-frame-14-x-42-above-ground-pool-set/" target="_blank" rel="noopener noreferrer" className="underline">
            Intex Prism Frame 14&apos; &times; 42&quot;
          </a>
          {" "}&mdash; 3,357 gal saltwater
        </Paragraph>

        {recs.length > 0 && (
          <>
            <H2>Recommendations</H2>
            <Card>
              <CardContent className="divide-y py-0">
                {recs.map((r, i) => (
                  <div key={i} className={styles.recRow}>
                    <div className={styles.recHeader}>
                      <span>
                        <Bold>{r.metric}:</Bold> {r.description}
                      </span>
                    </div>
                    <Small className={styles.recAmount}>
                      Possible solutions:
                    </Small>
                    <ul className={styles.recOptions}>
                      {r.options.map((opt) => (
                        <li key={opt}>{opt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        <H2>Ideal Ranges</H2>
        <Card>
          <CardContent className="divide-y py-0">
            {METRICS.map((m) => (
              <div key={m.key} className={styles.readingRow}>
                <span className={styles.metricLabel}>{m.label}</span>
                <div className="text-sm text-muted-foreground">
                  <div>Ideal: {m.ideal[0]}–{m.ideal[1]}{m.unit ? ` ${m.unit}` : ""}</div>
                  <div>Good: {m.good[0]}–{m.good[1]}{m.unit ? ` ${m.unit}` : ""}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <H2>Saltwater System Error Codes</H2>
        <Paragraph className="text-muted-foreground">
          Intex Krystal Clear CG-26667
        </Paragraph>
        <Card>
          <CardContent className="divide-y py-0">
            {ERROR_CODES.map((e) => (
              <div key={e.code} className="space-y-1 py-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{e.code}</Badge>
                  <Bold>{e.meaning}</Bold>
                </div>
                <Small className="text-muted-foreground">{e.fix}</Small>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function TestEntryForm({
  onSubmit,
}: {
  onSubmit: (readings: Partial<Record<MetricKey, number>>) => void;
}) {
  const [enabled, setEnabled] = useState<Partial<Record<MetricKey, boolean>>>(
    {},
  );
  const [values, setValues] = useState<Partial<Record<MetricKey, number>>>(
    () => {
      const init: Partial<Record<MetricKey, number>> = {};
      for (const m of METRICS) {
        init[m.key] = m.scale[Math.floor(m.scale.length / 2)];
      }
      return init;
    },
  );

  const toggle = (key: MetricKey) =>
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const readings: Partial<Record<MetricKey, number>> = {};
    for (const m of METRICS) {
      if (enabled[m.key] && values[m.key] !== undefined) {
        readings[m.key] = values[m.key];
      }
    }
    if (Object.keys(readings).length === 0) return;
    onSubmit(readings);
    setEnabled({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="divide-y">
        {METRICS.map((m) => {
          const on = !!enabled[m.key];
          const val = values[m.key] ?? m.scale[0];
          const status = on ? getStatus(val, m.good, m.ideal, m.danger) : "none";
          const scaleMin = m.scale[0];
          const scaleMax = m.scale[m.scale.length - 1];
          const step = m.key === "ph" ? 0.1 : 1;

          return (
            <div key={m.key} className={styles.sliderField}>
              <div className={styles.sliderHeader}>
                <div>
                  <button
                    type="button"
                    className={on ? styles.sliderLabel : styles.sliderLabelOff}
                    onClick={() => toggle(m.key)}
                  >
                    {m.label}
                  </button>
                  <div className={styles.sliderDescription}>
                    {m.description}
                  </div>
                </div>
                <div className={styles.sliderValueGroup}>
                  <span
                    className={on ? styles.sliderStatusText : styles.sliderValueOff}
                    style={on ? { color: STATUS_COLORS[status] } : undefined}
                  >
                    {on
                      ? status === "ideal"
                        ? "Ideal"
                        : status === "good"
                          ? "Good"
                          : status === "very-low"
                            ? "Very Low"
                            : status === "low"
                              ? "Low"
                              : status === "very-high"
                                ? "Very High"
                                : "High"
                      : ""}
                  </span>
                  <span className={on ? styles.sliderValue : styles.sliderValueOff}>
                    {on ? formatValue(m.key, val) : "—"}
                  </span>
                  {m.unit && (
                    <span className={styles.sliderUnit}>{m.unit}</span>
                  )}
                </div>
              </div>
              <div className={cn(!on && styles.sliderDisabled)}>
                <Slider
                  className={styles.gradientSlider}
                  style={{ "--slider-gradient": buildGradient(m) } as React.CSSProperties}
                  min={scaleMin}
                  max={scaleMax}
                  step={step}
                  value={[val]}
                  onValueChange={([v]) => {
                    if (!on) setEnabled((prev) => ({ ...prev, [m.key]: true }));
                    setValues((prev) => ({ ...prev, [m.key]: v }));
                  }}
                />
                <div className={styles.sliderTicks}>
                  {m.scale.map((tick, i) => {
                    const pct = ((tick - scaleMin) / (scaleMax - scaleMin)) * 100;
                    const isFirst = i === 0;
                    const isLast = i === m.scale.length - 1;
                    return (
                      <span
                        key={tick}
                        className={cn(
                          styles.sliderTick,
                          isFirst && styles.sliderTickFirst,
                          isLast && styles.sliderTickLast,
                        )}
                        style={{ left: `${pct}%` }}
                      >
                        {tick}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button type="submit" className="mt-4">
        Log Results
      </Button>
    </form>
  );
}
