import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Wifi, Snowflake, Droplets, Calculator, BookOpen } from "lucide-react";
import hero from "@/assets/hero-camper.jpg";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/components/site/LiveArticles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "autarkie-camper.de – Smart Travel & autarke Camping-Ausstattung" },
      { name: "description", content: "Ehrliche Vergleiche, Testberichte und der Camping-Stromrechner für dein autarkes Wohnmobil oder deinen Van." },
      { property: "og:title", content: "autarkie-camper.de – Autark reisen, smart ausgestattet" },
      { property: "og:description", content: "Vergleiche, Tests und Stromrechner für autarkes Camping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const TILES = [
  { to: "/strom-solar", label: "Strom & Solar", icon: Zap },
  { to: "/internet", label: "Internet & Connectivity", icon: Wifi },
  { to: "/kuehlung-kochen", label: "Kühlung & Kochen", icon: Snowflake },
  { to: "/wasser-autarkie", label: "Wasser & Autarkie", icon: Droplets },
  { to: "/rechner", label: "Rechner & Tools", icon: Calculator },
  { to: "/ratgeber", label: "Testberichte & Ratgeber", icon: BookOpen },
] as const;

function Index() {
  const { articles } = useArticles();
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Camper mit Solaranlage am Waldsee" width={1600} height={912} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 text-primary-foreground">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Frei stehen. Länger bleiben. Smart ausgestattet.</h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">Unabhängige Vergleiche für Strom, Internet, Kühlung und Wasser – damit dein Camper wirklich autark wird.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="cta"><Link to="/rechner">Stromrechner starten</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/strom-solar">Powerstationen vergleichen</Link></Button>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {TILES.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} className="group rounded-xl border bg-card p-6 shadow-card transition hover:-translate-y-1 hover:border-primary">
              <Icon className="size-8 text-primary" />
              <p className="mt-4 font-semibold group-hover:text-primary">{label}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-semibold">Neu im Ratgeber</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {articles.slice(0, 4).map((a) => (
            <Link key={a.slug} to="/ratgeber/$slug" params={{ slug: a.slug }} className="rounded-xl border bg-card p-6 hover:border-primary">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{a.type === "testbericht" ? "Testbericht" : "Ratgeber"}</p>
              <h3 className="mt-2 text-xl font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
