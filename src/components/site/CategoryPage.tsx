import { Link } from "@tanstack/react-router";
import { products, articles } from "@/lib/content";
import { CATEGORIES } from "@/lib/nav";
import { ProductCard } from "./ProductCard";

export function CategoryPage({ slug }: { slug: (typeof CATEGORIES)[number]["slug"] }) {
  const cat = CATEGORIES.find((c) => c.slug === slug)!;
  const list = products.filter((p) => p.category === slug);
  const posts = articles.filter((a) => a.category === slug);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Vergleich</p>
      <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{cat.label}</h1>
      <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{cat.intro}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <ProductCard key={p.slug} p={p} />)}
        {list.length === 0 && <p className="text-muted-foreground">Hier erscheinen bald die ersten Vergleiche.</p>}
      </div>
      {posts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">Ratgeber zum Thema</h2>
          <ul className="mt-4 space-y-3">
            {posts.map((a) => <li key={a.slug}><Link to="/ratgeber/$slug" params={{ slug: a.slug }} className="font-medium text-primary hover:underline">{a.title}</Link></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
