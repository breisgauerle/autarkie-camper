import { ExternalLink, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ArticleBlock } from "@/lib/article-body";

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="article-body mt-8 min-w-0">
    {blocks.map((block, index) => block.type === "html"
      ? <div key={index} className="prose-article" dangerouslySetInnerHTML={{ __html: block.html }} />
      : <aside key={index} aria-label={`Kaufangebote für ${block.box.product}`} className="my-8 min-w-0 rounded-lg border border-primary/25 bg-card p-5 shadow-card sm:p-6">
          <div className="flex items-start gap-3">
            <ShoppingBag aria-hidden="true" className="mt-1 size-6 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Produkt-Kaufbox</p>
              <h2 className="mt-1 break-words text-2xl font-semibold">{block.box.product}</h2>
              {block.box.price && <p className="mt-2 break-words text-sm font-medium text-muted-foreground">{block.box.price}</p>}
            </div>
          </div>
          {block.box.offers.length > 0 && <>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              {block.box.offers.map((offer, offerIndex) => <Button key={offerIndex} asChild variant={offerIndex === 0 ? "default" : "outline"} className="h-auto min-h-11 min-w-0 flex-1 px-3 py-3">
                <a href={offer.url} target="_blank" rel="nofollow sponsored noopener noreferrer"><span className="min-w-0 whitespace-normal break-words">{offer.label}*</span><ExternalLink aria-hidden="true" className="shrink-0" /></a>
              </Button>)}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">* Affiliate-Links: Bei einem Kauf erhalten wir gegebenenfalls eine Provision. Für dich entstehen keine Mehrkosten.</p>
          </>}
        </aside>)}
  </div>;
}