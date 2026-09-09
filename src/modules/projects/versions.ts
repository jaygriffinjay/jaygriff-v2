/**
 * Earlier incarnations of a project, shown as a time capsule on its page.
 *
 * A constant rather than rows: these are chapters of one project's history,
 * not projects in their own right, and nothing queries them.
 */
export type ProjectVersion = {
  label: string;
  href: string;
  note: string;
};

export const PROJECT_VERSIONS: Record<string, ProjectVersion[]> = {
  "jaygriff-com": [
    {
      label: "v0",
      href: "https://v0.jaygriff.com",
      note: "The first shell. Barely a site.",
    },
    {
      label: "v1",
      href: "https://v1.jaygriff.com",
      note: "Still a shell, but a tidier one.",
    },
    {
      label: "v2",
      href: "https://v2.jaygriff.com",
      note: "The first version that was a real app. Deprecated, but I'm still fond of it.",
    },
  ],
};

export function versionsFor(projectId: string) {
  return PROJECT_VERSIONS[projectId] ?? [];
}
