import { createFileRoute, Link } from "@tanstack/react-router";
import { useArticles } from "@/components/site/LiveArticles";
import { articles, type Article as ArticleData } from "@/lib/content";
import { ArticleBody } from "@/components/site/ArticleBody";

export const Route = createFileRoute("/ratgeber/$slug")({
  loader: ({ params, context }) => {
    const source = context.queryClient.getQueryData<ArticleData[]>(["public-github-articles"]) ?? articles;
    const a = source.find((x) => x.slug === params.slug);
    return a;
  },
  head: ({ loaderData: a }) => ({
    meta: a
      ? [
          { title: `${a.seo_title || a.title} | autarkie-camper.de` },
          { name: "description", content: a.seo_description || a.summary },
          { property: "og:title", content: a.seo_title || a.title },
          { property: "og:description", content: a.seo_description || a.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
          ...(a.image && /^https:\/\//.test(a.image) ? [
            { property: "og:image", content: a.image },
            { name: "twitter:image", content: a.image },
          ] : []),
        ]
      : [
          { title: "Artikel | autarkie-camper.de" },
          { name: "description", content: "Aktuelle Ratgeber und Testberichte für autarkes Camping." },
          { property: "og:title", content: "Artikel | autarkie-camper.de" },
          { property: "og:description", content: "Aktuelle Ratgeber und Testberichte für autarkes Camping." },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ],
  }),
  notFoundComponent: () => <div className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-3xl">Artikel nicht gefunden</h1><Link to="/ratgeber" className="text-primary underline">Zum Ratgeber</Link></div>,
  component: Article,
});

function Article() {
  const { slug } = Route.useParams();
  const { articles: live, pending } = useArticles();
  const a = live.find(article => article.slug === slug);
  if (!a) return <div className="mx-auto max-w-3xl px-4 py-20" aria-live="polite"><h1 className="text-3xl">{pending ? "Artikel wird geladen …" : "Artikel nicht gefunden"}</h1>{!pending && <Link to="/ratgeber" className="text-primary underline">Zum Ratgeber</Link>}</div>;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">{a.type === "testbericht" ? "Testbericht" : "Ratgeber"} · {new Date(a.date).toLocaleDateString("de-DE")}</p>
      <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">{a.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{a.summary}</p>
      {a.image && <img src={a.image} alt="" className="mt-8 w-full rounded-xl" />}
      <ArticleBody blocks={a.blocks} />
    </article>
  );
}
