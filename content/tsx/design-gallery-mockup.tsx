import { H2, Paragraph, Small } from "@/components/typography";

const MOCK_DESIGNS = [
  { title: "Empty state, take 2", hue: "from-sky-400 to-blue-600" },
  { title: "Pricing table redo", hue: "from-emerald-400 to-teal-600" },
  { title: "Onboarding flow v3", hue: "from-violet-400 to-purple-600" },
  { title: "Dark mode pass", hue: "from-slate-500 to-slate-800" },
  { title: "Mobile nav experiment", hue: "from-amber-400 to-orange-600" },
  { title: "Landing hero, loud version", hue: "from-rose-400 to-pink-600" },
];

export default function DesignGalleryMockup() {
  return (
    <>
      <Paragraph>
        This is a design, about the design gallery, that will show up in the
        design gallery. A mockup of the thing you're looking at, rendered
        through the exact feature it's mocking up.
      </Paragraph>

      <H2>What the tiles could look like</H2>
      <Paragraph>
        Six placeholder tiles, no real screenshots — just gradients standing
        in for thumbnails, so the grid, spacing, and hover treatment can be
        judged on their own.
      </Paragraph>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {MOCK_DESIGNS.map((design) => (
          <div key={design.title} className="flex flex-col gap-2">
            <div
              className={`aspect-4/3 rounded-xl border border-border bg-gradient-to-br ${design.hue}`}
            />
            <span className="text-sm font-medium">{design.title}</span>
          </div>
        ))}
      </div>

      <Small className="mt-4 block text-muted-foreground">
        The real thing pulls thumbnails from uploaded assets instead of
        gradients. This one just wanted to see the grid.
      </Small>
    </>
  );
}
