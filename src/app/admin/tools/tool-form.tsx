"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TOOL_SECTIONS } from "@/modules/tools/sections";
import { updateTool, type ToolFormValues } from "@/app/admin/actions/tools";

import styles from "./tools.module.css";

const STATUSES = [
  "active",
  "occasional",
  "benched",
  "shelved",
  "wishlist",
] as const;

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {hint && !error && <span className={styles.hint}>{hint}</span>}
      {error && <span className={styles.error}>{error[0]}</span>}
    </div>
  );
}

export function ToolForm({ initial }: { initial: ToolFormValues }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ToolFormValues>(
    key: K,
    value: ToolFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateTool(values);
      if (result.ok) {
        setErrors({});
        setSaved(true);
        return;
      }
      setErrors(result.fieldErrors ?? {});
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.formRow}>
        <Field label="Title" error={errors.title}>
          <Input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Field>

        <Field label="Section" error={errors.section}>
          <Select
            value={values.section}
            onValueChange={(v) => set("section", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TOOL_SECTIONS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Description"
        hint="The short line under the name. Keep the jokes."
        error={errors.description}
      >
        <Input
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <Field
        label="Note"
        hint="Leave empty for no expandable card."
        error={errors.note}
      >
        <Textarea
          rows={4}
          value={values.note ?? ""}
          onChange={(e) => set("note", e.target.value)}
        />
      </Field>

      <div className={styles.formRow}>
        <Field label="Status" error={errors.status}>
          <Select
            value={values.status}
            onValueChange={(v) => set("status", v as ToolFormValues["status"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Sort order" error={errors.sort_order}>
          <Input
            type="number"
            value={values.sort_order}
            onChange={(e) => set("sort_order", e.target.value)}
          />
        </Field>
      </div>

      <div className={styles.formRow}>
        <Field
          label="Logo path"
          hint="e.g. /tool-logos/react.svg"
          error={errors.logo}
        >
          <Input
            value={values.logo}
            onChange={(e) => set("logo", e.target.value)}
          />
        </Field>

        <div className={styles.checkboxField}>
          <Checkbox
            id="invert"
            checked={values.invert}
            onCheckedChange={(v) => set("invert", v === true)}
          />
          <label htmlFor="invert" className={styles.label}>
            Invert logo in dark mode
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {saved && <span className={styles.saved}>Saved</span>}
        {message && <span className={styles.formError}>{message}</span>}
      </div>
    </form>
  );
}
