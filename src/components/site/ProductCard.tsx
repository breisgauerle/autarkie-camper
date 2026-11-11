import { Check, Minus, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { settings, type Product } from "@/lib/content";
import { productAffiliateLinks } from "@/lib/affiliate-links";

export function ProductCard({ p, badge }: { p: Product; badge?: string | undefined }) {
  const offers = productAffiliateLinks(p, settings.amazon_tag);
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
        {offers.map((offer, index) => <Button key={`${offer.url}/${index}`} asChild variant={index === 0 ? "default" : "outline"} className="h-auto min-h-9 py-2"><a href={offer.url} target="_blank" rel="sponsored nofollow noopener noreferrer"><span className="min-w-0 whitespace-normal break-words">{offer.label}*</span><ExternalLink className="shrink-0" /></a></Button>)}
      </div>
    </article>
  );
}
