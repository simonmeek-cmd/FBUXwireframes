# Wireframe Builder – Project Synopsis

Project: Wireframe Builder (charity sites)
- Purpose: Low-fidelity pagebuilder for charity websites with drag/drop, editable copy/options, client/project/page management, and shareable/publishable prototypes.
- Core features:
  - Auth (Supabase) with protected routes.
  - Clients & projects CRUD; page templates (Homepage, Listing: News/Resources/Events, Detail pages, Search Results).
  - Drag/drop builder with component palette, property editor, per-project active/inactive component selection.
  - Global header/footer as common elements; JSON-driven nav (mega menu, 3 tiers, CTA buttons) + footer JSON.
  - Homepage-only components (hero, signposts, impact overview, CTAs, stats, content feed, etc.) with deep editability.
  - Listing pages: editable hero/filters/first 3 cards; rest placeholder. Search Results page with pagination fields.
  - Impact Overview flexible layout (quote/promo resizing when one is disabled).
  - Contextual help (“i” hover + popup) per component; help text editable.
  - Welcome page for published view (Fat Beehive logo + client logo, intro copy with formatting, date, page list, link to component showcase).
  - Publish view: public URLs `/publish/:projectId` (welcome) and `/publish/:projectId/:pageId`; page tabs; nav/footer links route within publish view.
  - Component showcase with inactive indicators and toggle to show/hide inactive components; accordion works in export.
  - Static export/Netlify deploy support (SSR for fidelity, interactive JS for menus/accordions).
  - Migration tool to import localStorage/JSON backups into Supabase.
  - Backups/exports: project publish/share, export for hosting, backup/import JSON.

Tech stack
- Frontend: React + TypeScript, Vite, Tailwind CSS, Zustand.
- Drag/drop: @dnd-kit/core + sortable.
- Routing: react-router-dom.
- Supabase: auth + Postgres (clients, projects, pages, etc.).
- Netlify: hosting + functions (API/publish endpoint).
- Build/tools: Vite, JSZip (zips), pdfjs-dist (nav parsing).
- Styling: Tailwind wireframe/soft blue palette.

Data model (Supabase)
- clients: id, name, created_at.
- projects: id, client_id, name, created_at, navigation_config, footer_config, welcome_page_config, active_components.
- pages: id, project_id, name, type, order_index (default 0), components JSONB (default []), created_at.
- (Comments/feedback table planned; not yet implemented.)

Key files
- src/App.tsx: routing + init.
- src/stores/useBuilderStore.ts: state, API calls.
- src/pages: Dashboard, ClientView, ProjectView, PageBuilder, Preview, Publish, MigrateData, WireframeShowcase, Login.
- src/components/wireframe: component library (header/footer, homepage blocks, listing/detail/search, etc.).
- src/components/builder: editor UI (palette, property editor, settings modals).
- netlify/functions/publish.ts: public project/page fetch for publish view.
- supabase-schema.sql: schema (order_index, components defaults included).

Environment variables
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- SUPABASE_URL (functions)
- SUPABASE_SERVICE_ROLE_KEY (functions)
- VITE_API_URL (optional; defaults to /.netlify/functions)

Setup (local)
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Ensure env vars set in `.env` or Netlify env.

Deploy
- GitHub: simonmeek-cmd/FBUXwireframes
- Netlify project: fbuxtooling; auto-deploy on main push.
- Public publish routes: `/publish/:projectId` (welcome) and `/publish/:projectId/:pageId`.

Notable UX/behavior
- Header present on every page; footer common and not addable from palette.
- Nav JSON supports 2- and 3-tier; mega menu aligned to nav width; hover states for child/grandchild; optional intro copy per top-level in mega.
- Welcome page index for export; page links stacked vertically; intro copy supports formatted lists/headings with spacing.
- Page tabs in publish view navigate via full reload to avoid SPA loops.
- Inactive components grayed in builder; muted red background in showcase; toggle to show inactive.

Testing checklist (smoke)
- Login works; Dashboard lists clients without “Invalid Date”.
- Publish: `/publish/:projectId` shows welcome; tabs switch pages; nav/footer links navigate; “i” help icons show on hover.
- Listing pages show first 3 editable cards; heroes align per spec; search results page shows hero + results + pagination.
- Component showcase renders visually with accordion working; inactive indicators visible.

Open items / future
- Click-to-comment with attribution (planned; not yet built).
- Re-check Publish page after latest infinite-loop fixes (now pure derived selection).


