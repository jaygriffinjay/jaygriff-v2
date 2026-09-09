"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateContent,
  type ContentFormValues,
} from "@/app/admin/actions/content";

import styles from "./content.module.css";

const TYPES = ["post", "doc", "thought", "link"] as const;
const STATUSES = ["draft", "published", "archived", "deleted"] as const;
const AUTHORSHIP = ["default", "handwritten", "ai-generated"] as const;

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

export function ContentForm({ initial }: { initial: ContentFormValues }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ContentFormValues>(
    key: K,
    value: ContentFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateContent(values);
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
      <Field label="Title" error={errors.title}>
        <Input
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </Field>

      <Field
        label="Slug"
        hint="Changing this changes the public URL."
        error={errors.slug}
      >
        <Input
          value={values.slug}
          onChange={(e) => set("slug", e.target.value)}
        />
      </Field>

      <Field label="Description" error={errors.description}>
        <Textarea
          rows={3}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className={styles.formRow}>
        <Field
          label="Type"
          hint="Moves it between /posts, /docs and /thoughts."
          error={errors.type}
        >
          <Select
            value={values.type}
            onValueChange={(v) => set("type", v as ContentFormValues["type"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Status" error={errors.status}>
          <Select
            value={values.status}
            onValueChange={(v) =>
              set("status", v as ContentFormValues["status"])
            }
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
      </div>

      <div className={styles.formRow}>
        <Field
          label="Authorship"
          hint="default = site-wide AI-assisted."
          error={errors.authorship}
        >
          <Select
            value={values.authorship}
            onValueChange={(v) =>
              set("authorship", v as ContentFormValues["authorship"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AUTHORSHIP.map((a) => (
                <SelectItem key={a} value={a}>
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Authors"
          hint="Humans only, comma separated."
          error={errors.authors}
        >
          <Input
            value={values.authors}
            onChange={(e) => set("authors", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Authorship note"
        hint="Overrides the default disclosure wording on thoughts."
        error={errors.authorship_note}
      >
        <Textarea
          rows={3}
          value={values.authorship_note ?? ""}
          onChange={(e) => set("authorship_note", e.target.value)}
        />
      </Field>

      <Field label="Tags" hint="Comma separated." error={errors.tags}>
        <Input
          value={values.tags}
          onChange={(e) => set("tags", e.target.value)}
        />
      </Field>

      <div className={styles.formRow}>
        <Field
          label="Project id"
          hint="Links this to a project row."
          error={errors.project_id}
        >
          <Input
            value={values.project_id ?? ""}
            onChange={(e) => set("project_id", e.target.value)}
          />
        </Field>

        <Field
          label="Source URL"
          hint="Used by link entries."
          error={errors.source_url}
        >
          <Input
            value={values.source_url ?? ""}
            onChange={(e) => set("source_url", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Feature" error={errors.feature}>
        <Input
          value={values.feature ?? ""}
          onChange={(e) => set("feature", e.target.value)}
        />
      </Field>

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
