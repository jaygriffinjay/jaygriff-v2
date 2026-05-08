"use client";

import { useState, useMemo, useCallback } from "react";
import type { Cpu } from "./data";
import { cpuNames } from "./cpu-names";
import styles from "./cpu-ladder.module.css";
import { cn } from "@/lib/utils";

function CpuName({ cpu }: { cpu: Cpu }) {
  const p = cpuNames[cpu.name];
  if (!p) return <span className={styles.cpuName}>{cpu.name}</span>;
  return (
    <span className={cn(styles.cpuName, cpu.brand === "intel" ? styles.cpuNameIntel : styles.cpuNameAmd)}>
      <span className={styles.segProductBrand}>{p.productBrand}</span>
      <span className={styles.segModifier}>{p.modifier}</span>
      <span className={styles.segTier}>{p.tier}</span>
      <span className={styles.segQualifier}>{p.qualifier}</span>
      <span className={styles.segPrefix}>{p.prefix}</span>
      <span className={styles.segModel}>{p.model}</span>
      <span className={styles.segSuffix}>{p.suffix}</span>
      <span className={styles.segVariant}>{p.variant}</span>
    </span>
  );
}

/** A row in the unified ladder: score + the Intel/AMD CPUs at that score. */
type LadderRow = {
  score: number;
  grade: string;
  intel: Cpu[];
  amd: Cpu[];
};

function buildLadder(cpus: Cpu[]): LadderRow[] {
  const byScore = new Map<number, { intel: Cpu[]; amd: Cpu[]; grade: string }>();

  for (const cpu of cpus) {
    if (!byScore.has(cpu.score)) {
      byScore.set(cpu.score, { intel: [], amd: [], grade: cpu.grade });
    }
    const bucket = byScore.get(cpu.score)!;
    if (cpu.brand === "intel") bucket.intel.push(cpu);
    else bucket.amd.push(cpu);
  }

  return Array.from(byScore.entries())
    .sort(([a], [b]) => b - a)
    .map(([score, { intel, amd, grade }]) => ({ score, grade, intel, amd }));
}

/** Build a flat sorted list of CPUs for one brand, for up/down nav. */
function buildBrandList(cpus: Cpu[], brand: "intel" | "amd"): Cpu[] {
  return cpus
    .filter((c) => c.brand === brand)
    .sort((a, b) => b.score - a.score);
}

/** Find closest match on the other brand by score. */
function findClosestMatch(
  cpu: Cpu,
  otherList: Cpu[]
): Cpu | null {
  if (otherList.length === 0) return null;
  let best = otherList[0];
  let bestDiff = Math.abs(best.score - cpu.score);
  for (const c of otherList) {
    const diff = Math.abs(c.score - cpu.score);
    if (diff < bestDiff) {
      best = c;
      bestDiff = diff;
    }
  }
  return best;
}

function gradeClass(grade: string): string {
  if (grade === "A+") return styles.gradeAPlus;
  if (grade === "A") return styles.gradeA;
  if (grade === "B") return styles.gradeB;
  if (grade === "C") return styles.gradeC;
  return styles.gradeD;
}

/** Grade boundaries for tier separators */
const TIER_LABELS: Record<string, string> = {
  "A+": "Flagship",
  A: "High End",
  B: "Mid Range",
  C: "Budget",
  D: "Legacy",
};

function SpecRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={styles.specRow}>
      <span className={styles.specLabel}>{label}</span>
      <span className={styles.specValue}>{value}</span>
    </div>
  );
}

function CompareCard({
  cpu,
  brand,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  cpu: Cpu;
  brand: "intel" | "amd";
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) {
  return (
    <div
      className={cn(
        styles.compareCard,
        brand === "intel" ? styles.compareIntel : styles.compareAmd
      )}
    >
      <div className={styles.compareCardHeader}>
        <button
          className={styles.navBtn}
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous CPU"
        >
          ▲
        </button>
        <div className={styles.compareCardTitle}>
          <CpuName cpu={cpu} />
        </div>
        <button
          className={styles.navBtn}
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next CPU"
        >
          ▼
        </button>
      </div>

      <div className={cn(styles.compareScore, gradeClass(cpu.grade))}>
        {cpu.score}
      </div>

      <div className={styles.specList}>
        <SpecRow label="Cores" value={cpu.cores} />
        <SpecRow label="TDP" value={cpu.tdp} />
        <SpecRow label="Cache" value={cpu.cache} />
        <SpecRow label="Node" value={cpu.node} />
        <SpecRow label="Single" value={cpu.singleCore} />
        <SpecRow label="Multi" value={cpu.multiCore} />
      </div>
    </div>
  );
}

export function CpuLadder({ cpus }: { cpus: Cpu[] }) {
  const [selected, setSelected] = useState<Cpu | null>(null);

  const ladder = useMemo(() => buildLadder(cpus), [cpus]);
  const intelList = useMemo(() => buildBrandList(cpus, "intel"), [cpus]);
  const amdList = useMemo(() => buildBrandList(cpus, "amd"), [cpus]);

  // Derive the Intel and AMD CPUs for the compare panel
  const intelCpu = useMemo(() => {
    if (!selected) return null;
    if (selected.brand === "intel") return selected;
    return findClosestMatch(selected, intelList);
  }, [selected, intelList]);

  const amdCpu = useMemo(() => {
    if (!selected) return null;
    if (selected.brand === "amd") return selected;
    return findClosestMatch(selected, amdList);
  }, [selected, amdList]);

  const navigateBrand = useCallback(
    (brand: "intel" | "amd", direction: -1 | 1) => {
      const list = brand === "intel" ? intelList : amdList;
      const current = brand === "intel" ? intelCpu : amdCpu;
      if (!current) return;
      const idx = list.findIndex((c) => c.name === current.name);
      const next = list[idx + direction];
      if (next) setSelected(next);
    },
    [intelList, amdList, intelCpu, amdCpu]
  );

  const intelIdx = intelCpu
    ? intelList.findIndex((c) => c.name === intelCpu.name)
    : -1;
  const amdIdx = amdCpu
    ? amdList.findIndex((c) => c.name === amdCpu.name)
    : -1;

  // Highlight: selected + its match in the ladder
  const isHighlighted = (cpu: Cpu) =>
    cpu.name === intelCpu?.name || cpu.name === amdCpu?.name;

  const handleSelect = useCallback(
    (cpu: Cpu) => {
      setSelected((prev) => (prev?.name === cpu.name ? null : cpu));
    },
    []
  );

  // Track grade changes for tier separators
  let lastGrade = "";

  return (
    <div className={styles.wrapper}>
      {/* ─── Brand Banners ─── */}
      <div className={styles.banners}>
        <div className={styles.bannerIntel}>Intel</div>
        <div className={styles.bannerCenter} />
        <div className={styles.bannerAmd}>AMD</div>
      </div>

      {/* ─── Compare Panel ─── */}
      {selected && intelCpu && amdCpu && (
        <div className={styles.comparePanel}>
          <CompareCard
            cpu={intelCpu}
            brand="intel"
            onPrev={() => navigateBrand("intel", -1)}
            onNext={() => navigateBrand("intel", 1)}
            hasPrev={intelIdx > 0}
            hasNext={intelIdx < intelList.length - 1}
          />

          <div className={styles.compareVs}>VS</div>

          <CompareCard
            cpu={amdCpu}
            brand="amd"
            onPrev={() => navigateBrand("amd", -1)}
            onNext={() => navigateBrand("amd", 1)}
            hasPrev={amdIdx > 0}
            hasNext={amdIdx < amdList.length - 1}
          />
        </div>
      )}

      {/* ─── Ladder ─── */}
      <div className={styles.ladder}>
        {ladder.map((row) => {
          const showTier = row.grade !== lastGrade;
          lastGrade = row.grade;

          return (
            <div key={row.score} className={styles.ladderRow}>
              {/* Tier separator */}
              {showTier && (
                <div className={styles.tierSep}>
                  <div className={styles.tierLine} />
                  <span className={styles.tierLabel}>
                    {TIER_LABELS[row.grade] ?? row.grade}
                  </span>
                  <div className={styles.tierLine} />
                </div>
              )}

              <div className={styles.rowGrid}>
                {/* Intel column */}
                <div className={styles.colIntel}>
                  {row.intel.length > 0 ? (
                    row.intel.map((cpu) => (
                      <button
                        key={cpu.name}
                        className={cn(
                          styles.row,
                          styles.rowIntel,
                          isHighlighted(cpu) && styles.rowActive
                        )}
                        onClick={() => handleSelect(cpu)}
                      >
                        <CpuName cpu={cpu} />
                      </button>
                    ))
                  ) : (
                    <div className={styles.emptyRow} />
                  )}
                </div>

                {/* Score divider */}
                <div className={styles.divider}>
                  <span
                    className={cn(styles.score, gradeClass(row.grade))}
                  >
                    {row.score}
                  </span>
                </div>

                {/* AMD column */}
                <div className={styles.colAmd}>
                  {row.amd.length > 0 ? (
                    row.amd.map((cpu) => (
                      <button
                        key={cpu.name}
                        className={cn(
                          styles.row,
                          styles.rowAmd,
                          isHighlighted(cpu) && styles.rowActive
                        )}
                        onClick={() => handleSelect(cpu)}
                      >
                        <CpuName cpu={cpu} />
                      </button>
                    ))
                  ) : (
                    <div className={styles.emptyRow} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
