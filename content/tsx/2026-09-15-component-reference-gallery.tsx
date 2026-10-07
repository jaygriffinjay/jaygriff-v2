import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlight,
  InlineCode,
  Small,
  Paragraph,
  Text,
  Blockquote,
  List,
  ListItem,
  Link,
} from "@/components/typography";
import { CodeBlock } from "@/components/code-block";
import { ContentHeader } from "@/components/content-header";
import { DisclosureNotice } from "@/components/content-disclosure";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const MOCK_ROW = {
  id: "mock",
  slug: "mock",
  file_path: null,
  content_hash: null,
  title: "Sample Content Header",
  description: "A stand-in row so the header can be previewed.",
  type: "thought",
  status: "published",
  format: "tsx",
  authors: null,
  authorship: "ai-generated",
  authorship_note: "A mock row used to preview the header in this gallery.",
  tags: null,
  updated_dates: null,
  thumbnail: null,
  images: null,
  project_id: null,
  feature: null,
  source_url: null,
  commit_hash: null,
  created_at: "2026-09-15T00:00:00.000Z",
  updated_at: "2026-09-15T00:00:00.000Z",
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <H2>{title}</H2>
      <div className="flex flex-col gap-4">{children}</div>
      <Separator className="my-8" />
    </>
  );
}

export default function ComponentReferenceGallery() {
  return (
    <>
      <Paragraph>
        A living reference for the components this site ships. Each section renders a
        component or family of components as they appear with the current theme.
      </Paragraph>

      <Section title="Typography">
        <H1>Heading 1</H1>
        <H2>Heading 2</H2>
        <H3>Heading 3</H3>
        <H4>Heading 4</H4>
        <H5>Heading 5</H5>
        <H6>Heading 6</H6>

        <Paragraph>
          A paragraph with <Bold>bold</Bold>, <Italic>italic</Italic>,{" "}
          <Underline>underline</Underline>, <Strikethrough>strikethrough</Strikethrough>,{" "}
          <Highlight>highlight</Highlight>, <InlineCode>inline code</InlineCode>, and a{" "}
          <Link href="/">link</Link>.
        </Paragraph>

        <Text>Plain text via the Text component.</Text>

        <Blockquote>A blockquote for quoted material or a callout-style pull line.</Blockquote>

        <List>
          <ListItem>First list item</ListItem>
          <ListItem>Second list item</ListItem>
          <ListItem>Third list item</ListItem>
        </List>

        <Small>Small / caption text.</Small>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">+</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled outline</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
      </Section>

      <Section title="Cards">
        <Card>
          <CardHeader>
            <CardTitle>Card title</CardTitle>
            <CardDescription>A supporting description for the card.</CardDescription>
          </CardHeader>
          <CardContent>
            <Paragraph>
              Card body content. Cards carry their own padding and border, so they work
              anywhere a grouped surface is needed.
            </Paragraph>
          </CardContent>
        </Card>
      </Section>

      <Section title="Inputs">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="gallery-input">Text input</Label>
            <Input id="gallery-input" placeholder="Placeholder text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="gallery-textarea">Textarea</Label>
            <Textarea id="gallery-textarea" placeholder="Multi-line placeholder" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="gallery-checkbox" defaultChecked />
              <Label htmlFor="gallery-checkbox">Checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="gallery-switch" defaultChecked />
              <Label htmlFor="gallery-switch">Switch</Label>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="tab-one">
          <TabsList>
            <TabsTrigger value="tab-one">Tab one</TabsTrigger>
            <TabsTrigger value="tab-two">Tab two</TabsTrigger>
            <TabsTrigger value="tab-three">Tab three</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-one"><Paragraph>Content for the first tab.</Paragraph></TabsContent>
          <TabsContent value="tab-two"><Paragraph>Content for the second tab.</Paragraph></TabsContent>
          <TabsContent value="tab-three"><Paragraph>Content for the third tab.</Paragraph></TabsContent>
        </Tabs>
      </Section>

      <Section title="Accordion">
        <Accordion type="single" collapsible defaultValue="item-one">
          <AccordionItem value="item-one">
            <AccordionTrigger>First accordion item</AccordionTrigger>
            <AccordionContent><Paragraph>Body of the first item.</Paragraph></AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-two">
            <AccordionTrigger>Second accordion item</AccordionTrigger>
            <AccordionContent><Paragraph>Body of the second item.</Paragraph></AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section title="Breadcrumb">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/thoughts">Thoughts</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Current page</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Section>

      <Section title="Table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Alpha</TableCell>
              <TableCell><Badge variant="outline">Active</Badge></TableCell>
              <TableCell>42</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Beta</TableCell>
              <TableCell><Badge variant="secondary">Draft</Badge></TableCell>
              <TableCell>17</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gamma</TableCell>
              <TableCell><Badge variant="destructive">Archived</Badge></TableCell>
              <TableCell>8</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>

      <Section title="Feedback">
        <div className="flex flex-col gap-4">
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>An informational alert.</AlertDescription>
          </Alert>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <Progress value={66} className="w-48" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Skeleton</span>
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Overlays">
        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog title</DialogTitle>
                <DialogDescription>A description for the dialog contents.</DialogDescription>
              </DialogHeader>
              <Paragraph>Dialog body content.</Paragraph>
              <DialogFooter><Button>Confirm</Button></DialogFooter>
            </DialogContent>
          </Dialog>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover for tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Section>

      <Section title="Misc">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar>
            <AvatarImage src="/images/me2.jpg" alt="Avatar" />
            <AvatarFallback>JG</AvatarFallback>
          </Avatar>
          <span className="flex items-center gap-2">
            Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> for the command palette
          </span>
        </div>
      </Section>

      <Section title="Content components">
        <ContentHeader row={MOCK_ROW} />

        <DisclosureNotice>
          An AI-generated artifact of work done with a coding agent.
        </DisclosureNotice>

        <CodeBlock language="tsx">
          {`export function Example() {
  return <Paragraph>Hello</Paragraph>;
}`}
        </CodeBlock>
      </Section>
    </>
  );
}