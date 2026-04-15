"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { H2, H3, Paragraph, Bold, Small } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  METRICS,
  DEFAULT_TRACKERS,
  ERROR_CODES,
  getRecommendations,
  getStatus,
  type MetricKey,
  type Recommendation,
} from "./pool-config";
import styles from "./pool.module.css";

// ─── Types ────────────────────────────────────────────────────────

type TestEntry = {
  id: string;
  date: string;
  readings: Partial<Record<MetricKey, number>>;
};

type TrackerTimestamps = Record<string, string>; // key → ISO timestamp

// ─── localStorage helpers ─────────────────────────────────────────

const LS_TESTS = "pool-test-log";
const LS_TRACKERS = "pool-trackers";

function loadTests(): TestEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LS_TESTS);
  return raw ? JSON.parse(raw) : [];
}

function saveTests(entries: TestEntry[]) {
  localStorage.setItem(LS_TESTS, JSON.stringify(entries));
}

function loadTrackers(): TrackerTimestamps {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(LS_TRACKERS);
  return raw ? JSON.parse(raw) : {};
}

function saveTrackers(t: TrackerTimestamps) {
  localStorage.setItem(LS_TRACKERS, JSON.stringify(t));
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatValue(key: MetricKey, value: number): string {
  return key === "ph" ? value.toFixed(1) : String(Math.round(value));
}

const STATUS_COLORS = {
  "very-low": "oklch(0.505 0.213 27.325)",
  low: "oklch(0.704 0.191 22.216)",
  good: "oklch(0.792 0.209 151.711)",
  ideal: "oklch(0.627 0.194 149.214)",
  high: "oklch(0.704 0.191 22.216)",
  "very-high": "oklch(0.505 0.213 27.325)",
  none: "oklch(0.556 0 0)",
} as const;

function buildGradient(m: { scale: number[]; danger: [number, number]; good: [number, number]; ideal: [number, number] }): string {
  const min = m.scale[0];
  const max = m.scale[m.scale.length - 1];
  const pct = (v: number) => (((Math.max(min, Math.min(max, v)) - min) / (max - min)) * 100).toFixed(1);

  const c = STATUS_COLORS;
  // Build symmetric stops: veryLow | low | good | ideal | good | low | veryLow (mirrored)
  return `linear-gradient(to right, ${c["very-low"]} 0%, ${c["very-low"]} ${pct(m.danger[0])}%, ${c.low} ${pct(m.danger[0])}%, ${c.low} ${pct(m.good[0])}%, ${c.good} ${pct(m.good[0])}%, ${c.good} ${pct(m.ideal[0])}%, ${c.ideal} ${pct(m.ideal[0])}%, ${c.ideal} ${pct(m.ideal[1])}%, ${c.good} ${pct(m.ideal[1])}%, ${c.good} ${pct(m.good[1])}%, ${c.low} ${pct(m.good[1])}%, ${c.low} ${pct(m.danger[1])}%, ${c["very-high"]} ${pct(m.danger[1])}%, ${c["very-high"]} 100%)`;
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

export function PoolDashboard() {
  const [tests, setTests] = useState<TestEntry[]>([]);
  const [trackers, setTrackers] = useState<TrackerTimestamps>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTests(loadTests());
    setTrackers(loadTrackers());
    setMounted(true);
  }, []);

  const latestReadings = tests[0]?.readings ?? {};
  const recs = getRecommendations(latestReadings);

  // ─── Test Log handlers ────────────────────────────────────────

  const addTestEntry = useCallback(
    (readings: Partial<Record<MetricKey, number>>) => {
      const entry: TestEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        readings,
      };
      const updated = [entry, ...tests];
      setTests(updated);
      saveTests(updated);
      // Auto-reset relevant trackers
      const t = { ...trackers };
      const chemKeys: MetricKey[] = [
        "totalHardness",
        "totalChlorine",
        "freeChlorine",
        "ph",
        "alkalinity",
        "stabilizer",
      ];
      if (chemKeys.some((k) => readings[k] !== undefined))
        t.chemicalTest = entry.date;
      setTrackers(t);
      saveTrackers(t);
    },
    [tests, trackers],
  );

  const markTrackerDone = useCallback(
    (key: string) => {
      const t = { ...trackers, [key]: new Date().toISOString() };
      setTrackers(t);
      saveTrackers(t);
    },
    [trackers],
  );

  if (!mounted) return null;

  return (
    <Tabs defaultValue="dashboard">
      <TabsList className="mb-6">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="log">Test Log</TabsTrigger>
        <TabsTrigger value="reference">Reference</TabsTrigger>
      </TabsList>

      {/* ═══ Dashboard Tab ═══ */}
      <TabsContent value="dashboard" className={styles.tabSection}>
        {/* Current Readings */}
        <H2>Current Readings</H2>
        {tests.length === 0 ? (
          <Paragraph className={styles.emptyState}>
            No test entries yet. Add one in the Test Log tab.
          </Paragraph>
        ) : (
          <>
            <Small>
              Last tested{" "}
              {new Date(tests[0].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Small>
            <div className={styles.grid}>
              {METRICS.map((m) => {
                const val = latestReadings[m.key];
                const status = getStatus(val, m.good, m.ideal, m.danger);
                return (
                  <Card key={m.key}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <span
                          className={cn(
                            styles.statusDot,
                            status === "very-low" && styles.statusVeryLow,
                            status === "low" && styles.statusLow,
                            status === "good" && styles.statusGood,
                            status === "ideal" && styles.statusIdeal,
                            status === "high" && styles.statusHigh,
                            status === "very-high" && styles.statusVeryHigh,
                            status === "none" && styles.statusNone,
                          )}
                        />
                        {m.label}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <span className={styles.metricValue}>
                        {val !== undefined ? formatValue(m.key, val) : "—"}
                      </span>
                      {m.unit && (
                        <span className={styles.metricUnit}>{m.unit}</span>
                      )}
                      <div className={styles.metricRange}>
                        Good: {m.good[0]}–{m.good[1]}{m.unit ? ` ${m.unit}` : ""} · Ideal: {m.ideal[0]}–{m.ideal[1]}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Recommendations */}
        {recs.length > 0 && (
          <>
            <Separator className="my-4" />
            <H2>Recommendations</H2>
            <div className="space-y-3">
              {recs.map((r, i) => (
                <RecommendationCard key={i} rec={r} />
              ))}
            </div>
          </>
        )}

        {/* Maintenance Trackers */}
        <Separator className="my-4" />
        <H2>Maintenance</H2>
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
                  <div className="flex items-center gap-3">
                    <span className={cn(styles.trackerElapsed, color)}>
                      {formatElapsed(ts)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markTrackerDone(t.key)}
                    >
                      Done
                    </Button>
                  </div>
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
        <H3>History</H3>
        {tests.length === 0 ? (
          <Paragraph className={styles.emptyState}>No entries yet.</Paragraph>
        ) : (
          <div className={styles.tableWrap}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {METRICS.map((m) => (
                    <TableHead key={m.key}>{m.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    {METRICS.map((m) => {
                      const val = entry.readings[m.key];
                      const status = getStatus(val, m.good, m.ideal, m.danger);
                      return (
                        <TableCell key={m.key}>
                          {val !== undefined ? (
                            <Badge
                              className={styles.historyBadge}
                              style={{
                                backgroundColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
                                color: status === "good" ? "oklch(0.27 0.07 152)" : "white",
                              }}
                            >
                              {formatValue(m.key, val)}
                            </Badge>
                          ) : (
                            "—"
                          )}
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
        <H2>Ideal Ranges</H2>
        <div className={styles.tableWrap}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Ideal Range</TableHead>
                <TableHead>Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {METRICS.map((m) => (
                <TableRow key={m.key}>
                  <TableCell>
                    <Bold>{m.label}</Bold>
                  </TableCell>
                  <TableCell>
                    {m.good[0]}–{m.good[1]} (ideal: {m.ideal[0]}–{m.ideal[1]})
                  </TableCell>
                  <TableCell>{m.unit || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-6" />

        <H2>Saltwater System Error Codes</H2>
        <Paragraph className="text-muted-foreground">
          Intex Krystal Clear CG-26667
        </Paragraph>
        <div className={styles.tableWrap}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Meaning</TableHead>
                <TableHead>What to Do</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ERROR_CODES.map((e) => (
                <TableRow key={e.code} className={styles.errorRow}>
                  <TableCell>
                    <Badge variant="outline">{e.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <Bold>{e.meaning}</Bold>
                  </TableCell>
                  <TableCell>{e.fix}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function RecommendationCard({ rec }: { rec: Recommendation }) {
  return (
    <div className={styles.recCard}>
      <Badge variant={rec.status === "low" ? "secondary" : "destructive"}>
        {rec.status}
      </Badge>
      <div>
        <Paragraph>
          <Bold>{rec.metric}:</Bold> {rec.action}
        </Paragraph>
        <Small className={styles.recAmount}>{rec.amount}</Small>
      </div>
    </div>
  );
}

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
                  {m.scale.map((tick) => (
                    <span key={tick} className={styles.sliderTick}>
                      {tick}
                    </span>
                  ))}
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
