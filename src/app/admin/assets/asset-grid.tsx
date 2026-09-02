"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { FileIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AssetRow } from "@/modules/assets/queries";
import type { R2Object } from "@/modules/r2/list";

import { assignAsset, unassignAsset } from "./actions";
import type { EntityOption } from "./queries";
import styles from "./assets.module.css";

const ROLES = ["thumbnail", "hero", "logo", "asset", "graphic", "video"];

const RASTER = new Set(["png", "jpg", "jpeg", "gif", "webp", "avif"]);
const VIDEO = new Set(["mp4", "webm", "mov"]);

function kindOf(key: string) {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  if (RASTER.has(ext)) return "raster";
  if (ext === "svg") return "svg";
  if (VIDEO.has(ext)) return "video";
  return "other";
}

function extensionOf(key: string) {
  const parts = key.split(".");
  return parts.length > 1 ? parts.pop()!.toUpperCase() : "FILE";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/** Filenames usually already say what they are, so pre-fill the obvious role. */
function guessRole(key: string) {
  const name = key.toLowerCase();
  if (VIDEO.has(name.split(".").pop() ?? "")) return "video";
  if (name.includes("logo")) return "logo";
  if (name.includes("thumb")) return "thumbnail";
  if (name.includes("hero")) return "hero";
  return "asset";
}

function Preview({ url, name }: { url: string; name: string }) {
  const kind = kindOf(name);

  if (kind === "raster" || kind === "svg") {
    return (
      <Image
        src={url}
        alt={name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        // the optimizer rejects SVG by default; these are small enough to serve raw
        unoptimized={kind === "svg"}
        className={styles.image}
      />
    );
  }

  if (kind === "video") {
    // metadata only: a grid of full video downloads would be brutal
    return <video src={url} preload="metadata" className={styles.video} />;
  }

  return (
    <div className={styles.file}>
      <FileIcon aria-hidden="true" />
      <span className={styles.fileExt}>{extensionOf(name)}</span>
    </div>
  );
}

export function AssetGrid({
  objects,
  assignments,
  entities,
}: {
  objects: R2Object[];
  assignments: AssetRow[];
  entities: EntityOption[];
}) {
  const [selected, setSelected] = useState<R2Object | null>(null);
  const [query, setQuery] = useState("");
  const [entityKey, setEntityKey] = useState("");
  const [role, setRole] = useState("asset");
  const [pending, startTransition] = useTransition();

  const byUrl = useMemo(() => {
    const map = new Map<string, AssetRow[]>();
    for (const row of assignments) {
      map.set(row.url, [...(map.get(row.url) ?? []), row]);
    }
    return map;
  }, [assignments]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entities.slice(0, 8);
    return entities
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.slug.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [entities, query]);

  function open(object: R2Object) {
    setSelected(object);
    setQuery("");
    setEntityKey("");
    setRole(guessRole(object.key));
  }

  function submit() {
    if (!selected || !entityKey) return;
    const entity = entities.find((e) => `${e.entity_type}:${e.id}` === entityKey);
    if (!entity) return;

    startTransition(async () => {
      await assignAsset({
        url: selected.url,
        role,
        entityType: entity.entity_type,
        entityId: entity.id,
      });
      setSelected(null);
    });
  }

  const current = selected ? (byUrl.get(selected.url) ?? []) : [];

  return (
    <>
      <div className={styles.grid}>
        {objects.map((object) => {
          const rows = byUrl.get(object.url) ?? [];
          return (
            <button
              key={object.key}
              type="button"
              onClick={() => open(object)}
              className={styles.card}
            >
              <div className={styles.preview}>
                <Preview url={object.url} name={object.key} />
                {rows.length > 0 && (
                  <Badge className={styles.badge}>{rows.length}</Badge>
                )}
              </div>
              <span className={styles.key}>{object.key}</span>
              <span className={styles.meta}>{formatSize(object.size)}</span>
            </button>
          );
        })}
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(next) => !next && setSelected(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className={styles.dialogTitle}>
              {selected?.key}
            </DialogTitle>
          </DialogHeader>

          {current.length > 0 && (
            <ul className={styles.assignmentList}>
              {current.map((row) => {
                const entity = entities.find(
                  (e) => e.entity_type === row.entity_type && e.id === row.entity_id
                );
                return (
                  <li key={row.id} className={styles.assignment}>
                    <span className={styles.assignmentText}>
                      {row.role} · {entity?.title ?? row.entity_id}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={pending}
                      onClick={() =>
                        startTransition(async () => {
                          await unassignAsset(row.id);
                        })
                      }
                    >
                      <XIcon aria-hidden="true" />
                      <span className="sr-only">Remove assignment</span>
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}

          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects and content…"
          />

          <ul className={styles.results}>
            {matches.map((entity) => {
              const key = `${entity.entity_type}:${entity.id}`;
              return (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setEntityKey(key)}
                    data-selected={entityKey === key || undefined}
                    className={styles.result}
                  >
                    <span className={styles.resultTitle}>{entity.title}</span>
                    <span className={styles.resultMeta}>
                      {entity.kind} · {entity.slug}
                    </span>
                  </button>
                </li>
              );
            })}
            {matches.length === 0 && (
              <li className={styles.resultMeta}>No matches</li>
            )}
          </ul>

          <div className={styles.controls}>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className={styles.roleSelect}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={submit} disabled={!entityKey || pending}>
              {pending ? "Saving…" : "Assign"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
