import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Battery, Sun } from "lucide-react";
import { CONSUMERS, calculate } from "@/lib/power";
import { products } from "@/lib/content";
import { ProductCard } from "@/components/site/ProductCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/rechner")({
  head: () => ({
    meta: [
      { title: "Camping-Stromrechner: Batterie & Solar berechnen | autarkie-camper.de" },
      { name: "description", content: "Berechne deinen Tagesverbrauch in Wh und Ah und finde die passende LiFePO4-Batterie, Solaranlage und Powerstation." },
      { property: "og:title", content: "Der Camping-Stromrechner" },
      { property: "og:description", content: "Tagesverbrauch berechnen und passende Batterie & Solar finden." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rechner,
});

function Rechner() {
  const [state, setState] = useState(() => Object.fromEntries(CONSUMERS.map((c) => [c.id, { on: ["kuehlbox", "licht", "laptop"].includes(c.id), hours: c.defaultHours, watts: c.watts }])));
  const r = useMemo(() => calculate(CONSUMERS.filter((c) => state[c.id].on).map((c) => state[c.id])), [state]);
  const set = (id: string, patch: Partial<(typeof state)[string]>) => setState((s) => ({ ...s, [id]: { ...s[id], ...patch } }));
  const stations = products.filter((p) => p.type === "powerstation").sort((a, b) => a.capacity_wh - b.capacity_wh);
  const fitting = stations.filter((p) => p.capacity_wh >= r.wh);
  const shown = (fitting.length ? fitting : stations.slice(-1)).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Rechner & Tools</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Der Camping-Stromrechner</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">Wähle deine Verbraucher und die tägliche Laufzeit – wir berechnen Verbrauch, Batterie und Solarleistung.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="divide-y rounded-xl border bg-card">
          {CONSUMERS.map((c) => {
            const v = state[c.id];
            return (
              <div key={c.id} className="flex flex-wrap items-center gap-3 p-4">
                <label className="flex min-w-48 flex-1 items-center gap-3 font-medium">
                  <Checkbox checked={v.on} onCheckedChange={(on) => set(c.id, { on: !!on })} /> {c.name}
                </label>
                <label className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Input type="number" min={0} className="w-20" value={v.watts} onChange={(e) => set(c.id, { watts: Number(e.target.value) })} aria-label={`${c.name} Watt`} /> W
                </label>
                <label className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Input type="number" min={0} max={24} step={0.5} className="w-20" value={v.hours} onChange={(e) => set(c.id, { hours: Number(e.target.value) })} aria-label={`${c.name} Stunden`} /> h/Tag
                </label>
              </div>
            );
          })}
        </div>
        <aside className="h-fit rounded-xl bg-secondary p-6 text-secondary-foreground shadow-card lg:sticky lg:top-24">
          <p className="text-sm opacity-80">Tagesverbrauch</p>
          <p className="font-display text-5xl font-semibold">{r.wh} <span className="text-2xl">Wh</span></p>
          <p className="mt-1 text-lg">= {r.ah} Ah bei 12 V</p>
          <div className="mt-6 space-y-3 rounded-lg bg-sidebar-accent p-4">
            <p className="flex items-center gap-2"><Battery className="text-primary-glow" /> mind. <b>{r.batteryAh} Ah LiFePO4</b></p>
            <p className="flex items-center gap-2"><Sun className="text-cta" /> mind. <b>{r.solarW} W Solarpanel</b></p>
          </div>
          <p className="mt-4 text-sm opacity-90">
            {r.wh > 0 ? `Du benötigst mindestens eine ${r.batteryAh} Ah LiFePO4 Batterie und ein ${r.solarW} W Solarpanel.` : "Wähle mindestens einen Verbraucher aus."}
          </p>
          <p className="mt-3 text-xs opacity-60">Annahmen: 90 % nutzbare Kapazität, 20 % Reserve, 4 Sonnenstunden, 75 % Wirkungsgrad.</p>
        </aside>
      </div>
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Passende Powerstationen anzeigen</h2>
        <p className="mt-1 text-muted-foreground">Modelle, die deinen Tagesbedarf von {r.wh} Wh abdecken.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p, i) => <ProductCard key={p.slug} p={p} badge={i === 0 ? "Beste Übereinstimmung" : undefined} />)}
        </div>
      </section>
    </div>
  );
}
