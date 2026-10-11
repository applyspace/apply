# Editing the website by hand

The website is this folder (`apps/web/src/site`) plus its routes in `apps/web/src/app/(site)/site/[locale]`. Paths below are relative to this folder, except those starting with `app/` (that is `apps/web/src/app/`).

## Run it

From the repo root, once per checkout: `pnpm install`, then `pnpm db:build` (the typecheck needs the db package built).

```bash
pnpm web          # same as: pnpm --filter web dev  →  http://localhost:3000
```

Signed out, `/` is the website. No `.env.local` is needed for it: without Sanity keys the pages read `content/fallback`, without `GEOAPIFY_API_KEY` the Map view draws its SVG Paris, without `NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL` the download buttons go to `/#download`.

Before a commit, from the repo root: `pnpm --filter web exec tsc --noEmit`, `pnpm --filter web lint`, `pnpm --filter web test`.

**Comments on localhost (Vercel Toolbar).** Link the folder to the Vercel project once per checkout, then restart `pnpm web`:

```bash
cd apps/web && vercel link --scope applyspace --project apply
```

The toolbar exists in development only (`components/dev/DevToolbar.tsx`); it never reaches a build. Not linked, it logs one line in the terminal and shows nothing.

## Where to change what

| I want to change | Go to |
|---|---|
| A colour, font, size, spacing or radius used across the site | `site.css` |
| Any word of the homepage | `content/fallback/home.ts` |
| A word shared by header, footer and pages (Sign in, Soon, Cookie settings...) | `content/ui.ts` |
| The header links (Product, Resources, Pricing), site name, footer links | `content/fallback/settings.ts` |
| The header menus (Product mega menu, Resources) | `content/nav.ts` |
| A page's tab title and search description | `content/fallback/pages.ts` (`home.seo`) |
| A section's layout, or the order of the sections | `components/home/<Section>.tsx`, order in `app/(site)/site/[locale]/page.site.tsx` |
| A product illustration (hero board, bento cards, views, devices) | `components/visuals/*.tsx` |
| Button height, padding, shape | `components/ui/buttonStyles.ts` |
| The font files | `lib/fonts.ts` |

### Design tokens: `site.css`

Six numbered sections, in this order: colours, fonts, font sizes, spacing, radii and widths, motion. **A name declared in `@theme` is also a Tailwind class**: `--text-display-xl` is `text-display-xl`, `--radius-card` is `rounded-card`, `--container-page` is `max-w-page`, `--color-hairline` is `border-hairline`. Change the value there and every use follows.

| Token | What it controls |
|---|---|
| `--text-display-xl / -lg / -md / -closing` | Title sizes (hero, "Track your entire job search.", other sections, closing), each with its line height |
| `--text-card-title`, `--text-body` | Bento card titles (19px), card text, buttons, menus, tabs (15px) |
| `--radius-tile / -card / -panel` | 20px (header bar, small tiles), 28px (cards), 40px (closing panel) |
| `--container-page` | Content width of the header, footer and home sections (1240px) |
| `--gutter` | Side margin of the home sections and the footer (16px, 24px from 640px) |
| `--section-xs / -sm / -md / -lg / -xl` | Vertical rhythm, mobile then from 640px (see below) |
| `--tile-*`, `--page-gradient`, `--closing-gradient` | Pastel tile gradients, page background, closing panel |
| `--display-weight / -tracking / -variation`, `--body-tracking` | Fraunces Italic for titles (`.font-display`), Geist SemiBold for the rest |

Section spacing: Hero top `--section-lg`; Boards top `--section-lg`, bottom `--section-xs`; Bento top and bottom `--section-md`; Views top `--section-md`, bottom `--section-xs`; Apps top and bottom `--section-md`; Closing top `--section-sm`, bottom `--section-xl`.

Colours of text are the `stone-*` greys and the ink `#1F0D2C`; the `brand-*` lilac is for backgrounds only, never for text.

Two things to know:
- A new `--text-*`, `--radius-*` or `--container-*` name must also be added to `lib/cn.ts`, otherwise `cn()` does not recognise it (a `text-body` next to a text colour would be dropped). `pnpm --filter web test` fails until it is.
- Pass such classes to shadcn components (`Badge`, `Button`) through `cn` from `@/site/lib/cn`, never `@/lib/utils`. `src/components/ui` is never edited.

Left in the components on purpose, change them in the file: hero tile layout (`TILES` in `components/home/HomeHero.tsx`), text widths like `max-w-[620px]`, shadows, gaps inside a section, the header bar's height and padding.

### Copy: `content/fallback/home.ts`

All homepage text in reading order: hero, boards, bento, views, apps, closing. `soon: true` shows a "Soon" badge, so keep it truthful. Job board logos come from each board's `domain` (Brandfetch). The homepage text is always read from this file, never from Sanity.

The site is English only: `lib/i18n.ts` lists `en`, and only `content/ui.ts` and `content/nav.ts` hold one entry per language. The files of `content/fallback` (`home.ts`, `pages.ts`, `settings.ts`...) would need the same shape before `fr` can be added.

If Sanity is configured, its `siteSettings` and `page` documents override the header links and tab titles; the header menus and the homepage text stay in code.

### Images and visuals

The homepage has no image files to swap. Product visuals are inline SVG in `components/visuals`, and the words drawn inside them (names, column titles) are in those files, not in `home.ts`. Their colours come from `--visual-text*` and `--tile-*`. The Map view uses `/home-map.png` (`app/home-map.png/route.site.ts`, Geoapify) and falls back to the SVG; its frame and pins are in `lib/homeMap.ts`.
