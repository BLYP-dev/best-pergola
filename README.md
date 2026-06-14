# BestPergola.co.uk

UK lead-generation site for homeowners looking for pergola installers. Astro + Tailwind, deployed to Cloudflare Pages. SSG + a single Cloudflare Pages Function for lead intake.

We are not the installer — we help match homeowners with suitable pergola installers in their area.

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
npm run build        # → dist/
npm run preview      # serve the production build locally
```

> Node 20.19+ is recommended (we're currently on 20.18 which emits engine warnings but builds fine).

## Stack

- **Astro 5** — static output by default, one SSR endpoint for the quote form
- **Tailwind v4** via `@tailwindcss/vite`
- **`@astrojs/cloudflare`** adapter (used for the lead-intake endpoint)
- **`@astrojs/sitemap`** for sitemap-index.xml

## Project structure

```
src/
  components/      Header, Footer, Hero, QuoteForm, FAQ, CostTable, …
  data/            counties.ts, towns.ts, services.ts, costs.ts, guides.ts, faqs.ts
  layouts/         PageLayout.astro
  lib/             site.ts, jsonld.ts
  pages/
    index.astro                                            Homepage
    [slug].astro                                           Services + costs + guides (dynamic)
    locations/index.astro                                  Locations hub
    locations/[county]/pergola-installers.astro            County page
    locations/[county]/[town]/pergola-installers.astro     Town page
    api/lead.ts                                            Quote-form intake (SSR)
    thank-you.astro
public/
  robots.txt, favicon.svg
```

## Adding data

- New county: append to `src/data/counties.ts`
- New town: append to `src/data/towns.ts` (must reference an existing county slug)
- New service / cost / guide page: append to the relevant data file — the route is auto-generated

URL patterns:
- `/locations/<county-slug>/pergola-installers/`
- `/locations/<county-slug>/<town-slug>/pergola-installers/`
- `/<slug>/` for services, costs and guides

## Lead intake

`POST /api/lead` accepts the quote form (JSON or form-encoded). For MVP it validates + logs the lead.
To wire up real delivery:

- **Email (Resend):** uncomment the TODO block in `src/pages/api/lead.ts`, set `RESEND_API_KEY` and `LEAD_NOTIFY_EMAIL` in Cloudflare Pages → Settings → Environment Variables.
- **Database (Supabase):** later — insert into a `leads` table from the same endpoint.

## Deploying to Cloudflare Pages

1. Push the repo to GitHub.
2. In the Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Add environment variables in Pages → Settings (do NOT commit `.env`).
6. First deploy will trigger automatically on push to the connected branch.

For local development of the SSR endpoint:

```bash
npm run build
npx wrangler pages dev dist
```

## SEO

- Unique titles, descriptions, canonical URLs and H1 per page
- Breadcrumbs + BreadcrumbList JSON-LD
- FAQPage JSON-LD on pages with FAQs
- Service / area-served JSON-LD on relevant pages
- `sitemap-index.xml` generated at build time
- `public/robots.txt` configured

## Roadmap (post-MVP)

- Installer profiles + featured installer per location
- Exclusive territory + paid subscription logic
- Supabase lead database + admin dashboard
- Cost calculator + planning permission checker
- Reviews

Structured so each of these can be added without disturbing the foundation.
