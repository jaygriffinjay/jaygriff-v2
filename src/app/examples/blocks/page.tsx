import {
  H1, H2, H3, H4, Paragraph, Small, Bold, Italic, InlineCode,
  Blockquote, Text, Link, List, ListItem,
} from "@/components/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/layout/Container";

// ── 1. StatCard ───────────────────────────────────────────────────────────────

function StatCard({ label, value, change, up }: { label: string; value: string; change?: string; up?: boolean }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Small className="text-muted-foreground uppercase tracking-wide text-xs">{label}</Small>
        <H3 className="mt-1 text-3xl font-bold">{value}</H3>
        {change && (
          <Small className={up ? "text-green-500" : "text-destructive"}>
            {up ? "↑" : "↓"} {change}
          </Small>
        )}
      </CardContent>
    </Card>
  );
}

// ── 2. QuoteCard ──────────────────────────────────────────────────────────────

function QuoteCard({ quote, author, role }: { quote: string; author: string; role?: string }) {
  return (
    <Card className="border-l-4 border-l-primary rounded-l-none">
      <CardContent className="pt-6">
        <Blockquote className="border-none pl-0 not-italic">
          <Italic>{quote}</Italic>
        </Blockquote>
        <div className="mt-4 flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarFallback className="text-xs">{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Bold className="text-sm">{author}</Bold>
            {role && <Small className="block">{role}</Small>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── 3. TagList ────────────────────────────────────────────────────────────────

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary">{tag}</Badge>
      ))}
    </div>
  );
}

// ── 4. ArticleMeta ────────────────────────────────────────────────────────────

function ArticleMeta({ date, readTime, tags }: { date: string; readTime: string; tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Small className="text-muted-foreground">{date}</Small>
      <Text className="text-muted-foreground text-xs">·</Text>
      <Small className="text-muted-foreground">{readTime}</Small>
      <Text className="text-muted-foreground text-xs">·</Text>
      <div className="flex gap-1.5">
        {tags.map((t) => (
          <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
        ))}
      </div>
    </div>
  );
}

// ── 5. TimelineEntry ──────────────────────────────────────────────────────────

function TimelineEntry({ date, title, body, last }: { date: string; title: string; body: string; last?: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="size-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
        {!last && <div className="w-px grow bg-border mt-1" />}
      </div>
      <div className="pb-6">
        <Small className="text-muted-foreground">{date}</Small>
        <H4 className="mt-0.5 text-sm font-semibold">{title}</H4>
        <Paragraph className="text-sm text-muted-foreground mt-1">{body}</Paragraph>
      </div>
    </div>
  );
}

// ── 6. Callout ────────────────────────────────────────────────────────────────

function Callout({ type, title, body }: { type: "info" | "warning" | "tip"; title: string; body: string }) {
  const icons = { info: "ℹ️", warning: "⚠️", tip: "💡" };
  return (
    <Alert>
      <AlertTitle>{icons[type]} {title}</AlertTitle>
      <AlertDescription>{body}</AlertDescription>
    </Alert>
  );
}

// ── 7. ProfileCard ────────────────────────────────────────────────────────────

function ProfileCard({ name, role, bio, initials }: { name: string; role: string; bio: string; initials: string }) {
  return (
    <Card>
      <CardContent className="pt-6 flex gap-4">
        <Avatar className="size-12 shrink-0">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <Bold>{name}</Bold>
          <Small className="block text-muted-foreground">{role}</Small>
          <Paragraph className="text-sm mt-2">{bio}</Paragraph>
        </div>
      </CardContent>
    </Card>
  );
}

// ── 8. KeyboardShortcut ───────────────────────────────────────────────────────

function KeyboardShortcut({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between py-2">
      <Small className="text-muted-foreground">{label}</Small>
      <KbdGroup>
        {keys.map((k) => <Kbd key={k}>{k}</Kbd>)}
      </KbdGroup>
    </div>
  );
}

// ── 9. EmptyState ─────────────────────────────────────────────────────────────

function EmptyState({ icon, heading, description, action }: { icon: string; heading: string; description: string; action?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <Text className="text-4xl">{icon}</Text>
      <H4>{heading}</H4>
      <Paragraph className="text-muted-foreground max-w-sm">{description}</Paragraph>
      {action && <Button variant="outline" className="mt-2">{action}</Button>}
    </div>
  );
}

// ── 10. SectionHeader ─────────────────────────────────────────────────────────

function SectionHeader({ label, heading, description, action, href }: { label?: string; heading: string; description?: string; action?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="space-y-1">
        {label && <Small className="text-primary uppercase tracking-widest text-xs font-semibold">{label}</Small>}
        <H2>{heading}</H2>
        {description && <Paragraph className="text-muted-foreground">{description}</Paragraph>}
      </div>
      {action && href && (
        <Link href={href} className="shrink-0 text-sm">{action} →</Link>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BlocksPage() {
  return (
    <Container>
      <div className="mb-8 flex items-center justify-between">
        <Link href="/examples" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
          ← examples
        </Link>
      </div>

      <div className="space-y-2 mb-10">
        <H1>Blocks</H1>
        <Paragraph className="text-muted-foreground text-lg">
          10 standalone components built from the primitive system.
        </Paragraph>
      </div>

      <div className="space-y-16">

        {/* 1. StatCard */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">1 — StatCard</H2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="Total Posts" value="42" change="12% this month" up />
            <StatCard label="Page Views" value="18.4k" change="3% this week" up />
            <StatCard label="Bounce Rate" value="64%" change="2% this week" up={false} />
            <StatCard label="Avg. Read Time" value="3.2m" />
          </div>
        </section>

        <Separator />

        {/* 2. QuoteCard */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">2 — QuoteCard</H2>
          <div className="max-w-lg">
            <QuoteCard
              quote="The best way to predict the future is to invent it."
              author="Alan Kay"
              role="Computer scientist"
            />
          </div>
        </section>

        <Separator />

        {/* 3. TagList */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">3 — TagList</H2>
          <TagList tags={["typescript", "next.js", "turso", "sqlite", "ai", "react", "tailwind", "passkeys"]} />
        </section>

        <Separator />

        {/* 4. ArticleMeta */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">4 — ArticleMeta</H2>
          <ArticleMeta date="March 30, 2026" readTime="4 min read" tags={["typescript", "databases"]} />
        </section>

        <Separator />

        {/* 5. TimelineEntry */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">5 — TimelineEntry</H2>
          <div className="max-w-md">
            <TimelineEntry date="March 30, 2026" title="Content pipeline shipped" body="Turso sync, AI metadata generation, and dynamic routes all working end to end." />
            <TimelineEntry date="March 29, 2026" title="Markdown renderer built" body="react-markdown wired up to the typography system. remark-gfm for tables and strikethrough." />
            <TimelineEntry date="March 28, 2026" title="Schema finalized" body="Single content table with nullable file_path for cool entries. UUID v4 for IDs." last />
          </div>
        </section>

        <Separator />

        {/* 6. Callout */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">6 — Callout</H2>
          <div className="space-y-3 max-w-lg">
            <Callout type="tip" title="Pro tip" body="Run sync after every batch of file changes, not after every individual edit." />
            <Callout type="warning" title="Watch out" body="Deleting a .md file does not remove the DB record. Archive it from the admin UI." />
            <Callout type="info" title="Note" body="Drafts are accessible via SSR even though they're hidden from listing pages." />
          </div>
        </section>

        <Separator />

        {/* 7. ProfileCard */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">7 — ProfileCard</H2>
          <div className="max-w-sm">
            <ProfileCard
              name="Jay Griffin"
              role="Software engineer"
              bio="Building things on the web. Writes about TypeScript, databases, and whatever's currently on the screen."
              initials="JG"
            />
          </div>
        </section>

        <Separator />

        {/* 8. KeyboardShortcut */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">8 — KeyboardShortcut</H2>
          <div className="max-w-xs divide-y divide-border">
            <KeyboardShortcut label="Command palette" keys={["⌘", "K"]} />
            <KeyboardShortcut label="Save" keys={["⌘", "S"]} />
            <KeyboardShortcut label="Search" keys={["⌘", "F"]} />
            <KeyboardShortcut label="New file" keys={["⌘", "N"]} />
          </div>
        </section>

        <Separator />

        {/* 9. EmptyState */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">9 — EmptyState</H2>
          <div className="border border-dashed border-border rounded-lg">
            <EmptyState
              icon="📭"
              heading="Nothing published yet"
              description="Drop a .md file into content/md/ and run the sync script to get started."
              action="Read the docs"
            />
          </div>
        </section>

        <Separator />

        {/* 10. SectionHeader */}
        <section className="space-y-4">
          <H2 className="text-base font-semibold text-muted-foreground">10 — SectionHeader</H2>
          <div className="space-y-8">
            <SectionHeader
              label="Latest"
              heading="Recent Posts"
              description="Writing, opinions, and longer-form thoughts."
              action="View all"
              href="/posts"
            />
            <SectionHeader heading="Docs" />
          </div>
        </section>

      </div>
    </Container>
  );
}
