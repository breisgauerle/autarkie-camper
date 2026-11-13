import { createFileRoute, Link } from "@tanstack/react-router";
import { useArticles } from "@/components/site/LiveArticles";

export const Route = createFileRoute("/ratgeber/")({
  head: () => ({
    meta: [
      { title: "Testberichte & Ratgeber | autarkie-camper.de" },
      { name: "description", content: "Praxistests und Ratgeber rund um Strom, Internet, Kühlung und Wasser im Camper." },
      { property: "og:title", content: "Testberichte & Ratgeber" },
      { property: "og:description", content: "Praxistests und Ratgeber für autarkes Camping." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Guides,
});

function Guides() {
  const { articles } = useArticles();
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-4xl font-semibold md:text-5xl">Testberichte & Ratgeber</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.slug} to="/ratgeber/$slug" params={{ slug: a.slug }} className="overflow-hidden rounded-xl border bg-card hover:border-primary">
            {a.image && <img src={a.image} alt="" loading="lazy" className="aspect-video w-full object-cover" />}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{a.type === "testbericht" ? "Testbericht" : "Ratgeber"} · {new Date(a.date).toLocaleDateString("de-DE")}</p>
              <h2 className="mt-2 text-xl font-semibold">{a.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{a.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
