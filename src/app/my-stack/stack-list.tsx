"use client";

import { cn } from "@/lib/utils";
import { H2 } from "@/components/typography";
import type { ToolRow } from "@/modules/tools/queries";
import { TOOL_SECTIONS } from "@/modules/tools/sections";

import { ToolCard, TOOL_STATUS_META, type ToolStatus } from "./ToolCard";
import styles from "./my-stack.module.css";

export function StackList({ tools }: { tools: ToolRow[] }) {
  return (
    <div className={styles.page}>
      <div className={styles.pillGroup}>
        <span className={styles.groupTitle}>Categories</span>
        <nav className={styles.pillGrid}>
          {TOOL_SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={styles.sectionPill}>
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div
        id="usage-legend"
        className={cn(styles.pillGroup, styles.legendGroup)}
      >
        <span className={styles.groupTitle}>Usage</span>
        <ul className={styles.legend}>
          {(Object.keys(TOOL_STATUS_META) as ToolStatus[]).map((status) => {
            const { label, hint, markClass } = TOOL_STATUS_META[status];
            return (
              <li key={status} className={styles.legendItem}>
                <span className={styles.legendLabel}>
                  {label}
                  {markClass && (
                    <span className={cn(styles.statusMark, markClass)}>*</span>
                  )}
                </span>
                <span className={styles.legendHint}>{hint}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {TOOL_SECTIONS.map((section) => {
        // getAllTools already sorts by status then sort_order
        const sectionTools = tools.filter((t) => t.section === section.id);
        if (sectionTools.length === 0) return null;

        // split in halves, not alternating, so the columns stack back into the
        // original order when the grid collapses to one column on mobile
        const half = Math.ceil(sectionTools.length / 2);
        const columns = [sectionTools.slice(0, half), sectionTools.slice(half)];

        return (
          <div key={section.id} id={section.id} className={styles.sectionBody}>
            <H2 className={styles.sectionHeading}>{section.label}</H2>
            <div className={styles.toolGrid}>
              {columns.map((column, index) => (
                <div key={index} className={styles.toolColumn}>
                  {column.map((tool) => (
                    <ToolCard
                      key={tool.id}
                      logo={tool.logo}
                      title={tool.title}
                      description={tool.description ?? ""}
                      note={tool.note ?? undefined}
                      invert={tool.invert}
                      status={tool.status}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
