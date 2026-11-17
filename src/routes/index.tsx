import { createFileRoute, Link } from "@tanstack/react-router";
import { Zap, Wifi, Snowflake, Droplets, Calculator, BookOpen } from "lucide-react";
import hero from "@/assets/hero-camper.jpg";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/components/site/LiveArticles";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLiveHome, homeContent } from "@/lib/home-content";
import { ArticleBody } from "@/components/site/ArticleBody";
import { parseArticleBody } from "@/lib/article-body";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const homeQuery = useQuery({ queryKey: ["public-github-home"], queryFn: () => fetchLiveHome(), enabled: mounted, retry: false, staleTime: 0, refetchOnWindowFocus: true });
  const home = homeQuery.data ?? homeContent;
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={hero} alt="Camper mit Solaranlage am Waldsee" width={1600} height={912} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 text-primary-foreground">
          {home.banner_slogan && <p className="mb-4 max-w-3xl whitespace-pre-line break-words text-base font-semibold">{home.banner_slogan}</p>}
          <h1 className="max-w-3xl whitespace-pre-line break-words text-4xl font-semibold leading-tight md:text-6xl">{home.hero_heading}</h1>
          <div className="prose-article mt-4 max-w-xl break-words text-lg opacity-90 [&_strong]:text-inherit [&_a]:text-inherit [&_li::marker]:text-inherit">
            <ArticleBody blocks={parseArticleBody(home.hero_intro)} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="cta" className="h-auto min-h-11 max-w-full whitespace-normal break-words text-center"><Link to="/rechner">{home.primary_button}</Link></Button>
            <Button asChild size="lg" variant="secondary" className="h-auto min-h-11 max-w-full whitespace-normal break-words text-center"><Link to="/strom-solar">{home.secondary_button}</Link></Button>
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
        <h2 className="break-words text-3xl font-semibold">{home.guides_heading}</h2>
        {home.guides_intro && <div className="mt-4 max-w-3xl break-words"><ArticleBody blocks={parseArticleBody(home.guides_intro)} /></div>}
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
