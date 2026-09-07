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
  updateProject,
  type ProjectFormValues,
} from "@/app/admin/actions/projects";

import styles from "./projects.module.css";

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

export function ProjectForm({ initial }: { initial: ProjectFormValues }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof ProjectFormValues>(
    key: K,
    value: ProjectFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProject(values);
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

        <Field label="Slug" hint="Used in /projects/…" error={errors.slug}>
          <Input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Tagline"
        hint="One sentence. Shown on the projects list."
        error={errors.tagline}
      >
        <Input
          value={values.tagline ?? ""}
          onChange={(e) => set("tagline", e.target.value)}
        />
      </Field>

      <Field
        label="Description"
        hint="Longer text for the project's own page."
        error={errors.description}
      >
        <Textarea
          rows={5}
          value={values.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className={styles.formRow}>
        <Field label="Status" error={errors.status}>
          <Select
            value={values.status}
            onValueChange={(v) =>
              set("status", v as ProjectFormValues["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">published</SelectItem>
              <SelectItem value="draft">draft</SelectItem>
              <SelectItem value="archived">archived</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field
          label="Icon"
          hint="Lucide name, e.g. globe. Fallback when no logo asset."
          error={errors.icon}
        >
          <Input
            value={values.icon ?? ""}
            onChange={(e) => set("icon", e.target.value)}
          />
        </Field>
      </div>

      <Field
        label="App link"
        hint="The primary destination. Leave empty if it isn't usable."
        error={errors.app_href}
      >
        <Input
          value={values.app_href ?? ""}
          onChange={(e) => set("app_href", e.target.value)}
        />
      </Field>

      <div className={styles.formRow}>
        <Field
          label="Demo link"
          hint="Reachable but not a finished product."
          error={errors.demo_url}
        >
          <Input
            value={values.demo_url ?? ""}
            onChange={(e) => set("demo_url", e.target.value)}
          />
        </Field>

        <Field label="Repo link" error={errors.repo_url}>
          <Input
            value={values.repo_url ?? ""}
            onChange={(e) => set("repo_url", e.target.value)}
          />
        </Field>
      </div>

      <div className={styles.formRow}>
        <Field
          label="Tags"
          hint="Comma separated, e.g. AI, Streaming, wip"
          error={errors.tags}
        >
          <Input
            value={values.tags}
            onChange={(e) => set("tags", e.target.value)}
          />
        </Field>

        <Field label="Sort order" error={errors.sort_order}>
          <Input
            type="number"
            value={values.sort_order}
            onChange={(e) => set("sort_order", e.target.value)}
          />
        </Field>
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
