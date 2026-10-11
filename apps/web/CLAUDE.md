# apps/web — Claude instructions

> For git conventions and monorepo structure, see the root [CLAUDE.md](../../CLAUDE.md).

## Stack

- **Framework** — Next.js 16 (App Router, Server Components)
- **Language** — TypeScript (strict mode)
- **Styling** — Tailwind CSS v4 + shadcn/ui
- **Auth** — Supabase Auth (Google and LinkedIn OIDC)
- **Database** — Supabase PostgreSQL for signed-in users (Row Level Security); the public demo (`demo.applyspace.app`, host-based, see `lib/demo-host.ts`) is served from memory (`lib/demo.ts`) and never reads a session; every other host requires sign-in; no local database (the desktop app signs in and uses Supabase too)
- **Deployment** — Vercel
- **Package manager** — pnpm
- **Demo account** — a fictional seeded user for previews (`/auth/demo`, `scripts/demo-seed.mts`); the public demo stays read-only and sends no analytics; see `docs/demo-account.md`

## Code conventions

- Components: PascalCase (`JobCard.tsx`, `AppShell.tsx`)
- Utilities and lib files: camelCase (`formatDate.ts`, `jobs.ts`)
- Named exports only — no default exports
- Shared app types live in `packages/core` (`@apply/core/[domain]`), not in the web app
- Server Components by default — use `'use client'` only when necessary (interactivity, hooks)

## Project structure

```
src/
├── app/
│   ├── (auth)/         # Authenticated routes: /, /offers, /applications, /processes, /settings
│   ├── (public)/       # Public routes: /login
│   └── api/            # Route handlers: settings, auth, linkedin/profile
├── components/
│   ├── layout/         # AppShell, Sidebar
│   ├── jobs/           # JobCard, JobGrid, JobFilters
│   ├── settings/       # SettingsShell + tabs (Profile, Criteria, Platforms)
│   ├── changelog/      # WhatsNew sheet
│   ├── providers/      # Providers (SessionProvider, LocaleProvider)
│   └── ui/             # shadcn/ui components — do not modify
├── lib/
│   ├── profiles.ts, searches.ts, offers.ts, applications.ts, …   # Readers: Supabase when signed in, fixtures on the demo, else empty
│   ├── settings.ts     # Read/write user settings (Supabase when signed in)
│   ├── supabase/       # Clients, request scope, row helpers and queries
│   ├── resume/         # Resume parser server glue: optional Claude provider (off by default), parseResumeText
│   ├── profileImport.ts # Executes a reviewed import plan (merge into experiences, education, skills); actions in app/profile-import
│   │                    # Onboarding import step: components/onboarding/v2/ResumePrefill.tsx (upload, parse, prefill role step, review sheet)
│   ├── sources.ts      # Platform metadata (labels, colors, cookie keys)
│   ├── i18n.ts         # EN / FR translations
│   └── utils.ts        # Shared helpers
```

## Public website (same app)

- The marketing website lives in this app: pages in `src/app/(site)/site/[locale]` (internal URLs `/site/en/...`), code in `src/site` (components, content, lib), plus `src/app/og`, `src/app/sitemap.xml`, `src/app/robots.txt`, `src/app/api/revalidate`.
- Routing (`src/lib/site-routing.ts`, unit-tested, used by `src/proxy.ts`): signed-out visitors see the website on `/`, `/product`, `/pricing`, `/resources/*`; signed-in users never see it (`/` is Home, marketing pages redirect to `/`). Internal `/site/...` and `/en/...` URLs redirect to the clean public URL.
- Website files use the `.site.tsx` / `.site.ts` extension. `pnpm build:desktop` sets `APPLY_DESKTOP_BUILD=1`, so `next.config.ts` drops that extension from `pageExtensions` and the website is never compiled into the .dmg (and `APPLY_SITE_ENABLED=0` turns the routing off). Never import `@/site/*` from app code.
- Two root layouts: `src/app/(app)/layout.tsx` (product) and `src/app/(site)/site/[locale]/layout.site.tsx` (website, static, its own CSS `src/site/site.css`).
- Sanity Studio: `studio/` at the repo root.
- Art direction v3 (definitive): Fraunces Italic 360 (SOFT 100, WONK 1, opsz 144) for titles (`.font-display`), Geist SemiBold 600 for every other text (only 600 and 700 are loaded, self-hosted in `src/site/fonts`), aubergine ink `#1F0D2C`, lilac-to-white page gradient, pastel tile gradients (`--tile-*` in `site.css`). Buttons and badges use shadcn/ui (`@/components/ui/button`, `badge`) through `buttonStyles` and the shadcn tokens defined in `site.css`.
- Homepage (`page.site.tsx`, components in `src/site/components/home`), founder feedback of 10-11 Oct 2026: Hero, job boards with logos (`Boards`), one bento of every feature (`Bento`, "Track your entire job search."), the four views (`Views`), the apps (`Apps`), the closing call. No pricing, FAQ, privacy band or steps on the home. Copy in `content/fallback/home.ts` (`getHome`), SEO from the `home` page document; planned features carry `soon: true`.
- Product visuals are inline SVG server components in `src/site/components/visuals` (no screenshots, no HTML product screens, no live demos on the home): `HeroBoardVisual`, `bento.tsx` (transparent, on the card's pastel tile; `sv-*` classes in `site.css` run before/after loops only under `prefers-reduced-motion: no-preference`, the resting state is the "after"), `views.tsx` (Linear-like app window fading into the page), `devices.tsx`. Client components on the home: `ViewTabs` only.
- Map view: `/home-map.png` (`src/app/home-map.png/route.site.ts`) serves a Geoapify static map fetched on the server with the app's `GEOAPIFY_API_KEY` (never sent to the browser, cached a week; `.png` paths skip the proxy, so it is public). Without the key the route 404s and the view draws its SVG Paris. Frame and pins share `lib/homeMap.ts`.
- Job board logos: Brandfetch (`@/lib/brandfetch`, `NEXT_PUBLIC_BRANDFETCH_CLIENT_ID` or the app's public default) as CSS backgrounds over a letter tile, so a failed logo degrades without JavaScript.
- Header: plume left, nav centre, ghost "Sign in" and primary "Get started for free", in a white rounded sticky bar. `DesktopNav` (client, hand-written, no menu library) opens the server-rendered `NavPanel` menus defined in `content/nav.ts` (keyed by the CMS nav href: `/product` mega menu by Find/Apply/Track/Prepare, `/resources`): hover, click, Enter/Space/ArrowDown open, Escape closes and returns focus, arrows move; without JavaScript CSS opens them on hover/focus. Entries without a page (What's new, Help center) show "Soon" and no link. `MobileMenu` shows the same groups as an accordion.
- No purple text anywhere: text is ink or the stone greys (founder, 10 Oct 2026); the `brand-*` palette is for backgrounds only.
- Other pages (/product) still use the live demos in `src/site/components/demos` (pure views rendered on the server, swapped by `DemoIsland` for the live client component near the viewport). Never import app components or `@/lib/*` there.
- First-load JS budget of site pages: 170 kB gzip. PostHog is not in it: the app initialises it in `components/analytics/posthogInit.ts` (imported by `Providers`); the website fetches `SiteAnalytics` on idle, asks for consent in a non-modal banner at the bottom centre ("Accept all" and "Reject all" with equal weight; Esc is not a choice; the footer's "Cookie settings" button, `data-cookie-settings`, reopens it), then loads posthog-js for page views and CTA clicks only (`website_cta_clicked`, see `docs/analytics-taxonomy.md`).
- Feature grid (`type: 'features'`, /product): every Feature, shipped or planned, as short cards by area; planned ones carry `soon: true` and a "Soon" tag (flip it when a feature ships). Product sections shared by both pages are defined once in `content/fallback/pages.ts`.
- "Download for macOS" opens `NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL`, or the homepage `#download` section while it is unset. Job board names appear only in the homepage boards line (founder decision, 11 Oct 2026, with "Brands belong to their owners"); never show counts or figures that depend on a plan (prices, limits) outside `/pricing`.
