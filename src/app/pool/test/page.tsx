export default function ColorTest() {
  const colors = [
    ["red-500", "bg-red-500"],
    ["red-400", "bg-red-400"],
    ["amber-500", "bg-amber-500"],
    ["amber-400", "bg-amber-400"],
    ["yellow-500", "bg-yellow-500"],
    ["emerald-500", "bg-emerald-500"],
    ["emerald-400", "bg-emerald-400"],
    ["green-500", "bg-green-500"],
    ["green-400", "bg-green-400"],
    ["teal-500", "bg-teal-500"],
    ["blue-500", "bg-blue-500"],
    ["sky-500", "bg-sky-500"],
    ["violet-500", "bg-violet-500"],
  ];

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Tailwind Color Test</h1>

      <div className="space-y-2">
        {colors.map(([name, cls]) => (
          <div key={name} className="flex items-center gap-3">
            <div className={`size-8 rounded ${cls}`} />
            <span className="text-sm font-mono">{name}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8">CSS Module Classes (from pool.module.css)</h2>
      <p className="text-sm text-muted-foreground">
        If module dots show color but inline above don&apos;t, the issue is Tailwind purging.
        If both are gray, something else is wrong.
      </p>
    </div>
  );
}
