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
- Uploaded site logos use a CDN asset pointer in the shared header and a separate padded 64px public favicon so navigation stays consistent without shipping the full image as an icon.
- Article purchase boxes are stored as fenced `produkt-kaufbox` JSON blocks; keep the Decap editor serializer and browser-safe article parser compatible, rendering validated offers through the shared Button component so static export works without a runtime service.
- Content lives in src/content and Decap; articles share one browser-only public GitHub refresh configured from the allowlisted repo/branch in admin/config.yml with local import.meta.glob fallback, while products/settings remain build-time files, so FTP hosting needs no server or credentials.
- Articles use Decap json-frontmatter and one shared validated parser for local and public GitHub files so editor content behaves consistently.
- Admin status shows only validated allowlisted Decap settings; its explicit read-only GitHub check uses the existing decap-cms-user GitHub session only against api.github.com with redirects disabled and sanitized results, while Netlify account setup stays unverified.
- Fonts are bundled from Fontsource packages rather than external stylesheets to avoid third-party font requests.
- Products use an optional affiliate_links list capped at three validated HTTPS offers; an explicit list replaces legacy offers while absent lists retain legacy Amazon tagging.
- Static export enumerates public routes and article files at build time, excludes the existing static Decap admin entry from prerendering, and uploads only verified dist/client output to Apache hosting.
- Apache serves exported routes first and a TanStack-generated client shell only for new extensionless article URLs; all other missing URLs/assets retain HTTP 404 through the script-free ErrorDocument, avoiding a global soft-404 fallback.
- Preserve trailing slashes in TanStack Router so directory-serving preview/Apache URLs and slashless links do not form redirect loops during static prerendering.
- Run prepare-static.mjs before Apache packaging to remove hydration scripts from ErrorDocument (the original unknown URL remains in the address bar) and strip Worker-only _headers.
- Apache preparation materializes asset-pointer URLs under their exact export paths using a public origin and validates downloaded type/size so CDN-backed images also work on independent hosting.
