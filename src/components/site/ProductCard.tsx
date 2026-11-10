import { Check, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { amazonUrl, type Product } from "@/lib/content";

export function ProductCard({ p, badge }: { p: Product; badge?: string }) {
  const amz = amazonUrl(p.amazon_asin);
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-card">
      {p.image && <img src={p.image} alt={p.name} loading="lazy" className="mb-4 aspect-[4/3] w-full rounded-lg object-cover" />}
      {badge && <span className="mb-2 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{badge}</span>}
      <h3 className="text-xl font-semibold">{p.name}</h3>
      <dl className="mt-3 space-y-1 text-sm">
        {p.specs.map((s) => (
          <div key={s.label} className="flex justify-between gap-2 border-b border-border/60 py-1"><dt className="text-muted-foreground">{s.label}</dt><dd className="text-right font-medium">{s.value}</dd></div>
        ))}
      </dl>
      <ul className="mt-3 space-y-1 text-sm">
        {p.pros.map((x) => <li key={x} className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />{x}</li>)}
        {p.cons.map((x) => <li key={x} className="flex gap-2 text-muted-foreground"><Minus className="size-4 shrink-0 text-destructive" />{x}</li>)}
      </ul>
      <div className="mt-auto flex flex-col gap-2 pt-5">
        {p.merchant_url && <Button asChild><a href={p.merchant_url} target="_blank" rel="sponsored nofollow noopener">Beim Fachhändler* <ExternalLink /></a></Button>}
        {amz && <Button asChild variant="cta"><a href={amz} target="_blank" rel="sponsored nofollow noopener">Bei Amazon ansehen*</a></Button>}
      </div>
    </article>
  );
}
