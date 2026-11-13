<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Article purchase boxes are stored as fenced `produkt-kaufbox` JSON blocks; keep the Decap editor serializer and browser-safe article parser compatible, rendering validated offers through the shared Button component so static export works without a runtime service.
- Content (articles, products, settings) lives as files in src/content and is edited via Decap CMS (public/admin/config.yml); pages read it with import.meta.glob so the site needs no database.
- Articles use Decap json-frontmatter (JSON object, then Markdown); keep the parser in src/lib/content.ts in sync with that format.
- Admin status shows only validated allowlisted Decap settings; its explicit read-only GitHub check uses the existing decap-cms-user GitHub session only against api.github.com with redirects disabled and sanitized results, while Netlify account setup stays unverified.
- Fonts are bundled from Fontsource packages rather than external stylesheets to avoid third-party font requests.
- Products use an optional affiliate_links list capped at three validated HTTPS offers; an explicit list replaces legacy offers while absent lists retain legacy Amazon tagging.
- Static export enumerates public routes and article files at build time, excludes the existing static Decap admin entry from prerendering, and uploads only verified dist/client output to Apache hosting.
- Apache serves exported route index files before directory handling and uses the shared prerendered /404 page as ErrorDocument; missing URLs and assets must retain HTTP 404, never an HTTP 200 SPA fallback.
- Preserve trailing slashes in TanStack Router so directory-serving preview/Apache URLs and slashless links do not form redirect loops during static prerendering.
- Run prepare-static.mjs before Apache packaging to remove hydration scripts from ErrorDocument (the original unknown URL remains in the address bar) and strip Worker-only _headers.
