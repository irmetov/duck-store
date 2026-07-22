# Duck Donuts — Headless Shopify Storefront

Custom Next.js storefront for **Duck Donuts rubber duckies**. Shopify is the commerce backend (catalog, cart, checkout, payments). The UI is fully custom and theme-driven for fast AI redesigns.

## Stack

- Next.js App Router + React + TypeScript
- Tailwind CSS v4 (semantic design tokens)
- Shopify Storefront API + hosted checkout
- Radix Dialog (drawer/modal), Embla Carousel (gallery)

## Architecture

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Commerce | `lib/shopify/*` | GraphQL, cart, money, normalize |
| UI | `components/*` | Layout, sections, product UI |
| Theme | `styles/theme.css`, `lib/theme/*` | Tokens + visual presets |
| Content | `config/*` | Store name, nav, homepage sections |

See [AI_DESIGN_GUIDE.md](./AI_DESIGN_GUIDE.md) before visual refactors.

## Shopify setup

1. Create or open a Shopify store.
2. **Settings → Apps and sales channels → Develop apps → Create an app.**
3. Enable **Storefront API** scopes: products, collections, cart, checkout.
4. Install the app and copy the **Storefront API access token**.
5. Copy `.env.example` → `.env.local` and fill:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
SHOPIFY_API_VERSION=2025-01
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

6. (Optional for seeding) Enable Admin API scopes `write_products` and `write_files`, then set `SHOPIFY_ADMIN_ACCESS_TOKEN`.

## Seed sample products (10 rubber duckies)

Product photos live in `public/images/products/` (generated with Higgsfield Nano Banana 2).

```bash
# requires SHOPIFY_ADMIN_ACCESS_TOKEN + SHOPIFY_STORE_DOMAIN in env
npm run seed
```

This creates collections `classics`, `seasonal`, `limited` and up to 10 ACTIVE products with images and prices.

## Local development

```bash
npm install
cp .env.example .env.local
# fill Shopify credentials
npm run seed   # optional
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run seed` | Seed Shopify sample catalog |

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in Vercel.
3. Add the same env vars (`SHOPIFY_*`, `NEXT_PUBLIC_SITE_URL`, optional `REVALIDATE_SECRET`).
4. Deploy. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. (Optional) Point a Shopify webhook / Admin flow at `/api/revalidate?secret=...` to refresh product caches.

## Implemented MVP features

- Homepage assembled from `config/homepage.ts` sections
- Product catalog with sort/filter basics
- Collection pages
- Product detail (gallery, variants, quantity, add to cart)
- Cart drawer + `/cart` page, cookie-persisted cart ID
- Redirect to Shopify hosted checkout
- Search
- SEO metadata, sitemap, robots, product JSON-LD
- Duck Donuts playful theme tokens
- Accessible drawer / focus states / responsive grids

## Known limitations

- Catalog requires a live Shopify store + Storefront token (no local product DB).
- Sample seed needs Admin API token; Admin GraphQL product image APIs can vary by API version.
- Newsletter section is UI-only (no ESP).
- No customer accounts, wishlist, i18n, or multi-currency.
- Filters are Storefront query-based (not a full faceted search engine).

## Next steps

1. Connect production Shopify credentials and run `npm run seed`.
2. Tune homepage copy/collections handles to match your Admin catalog.
3. Add Shopify webhook → `/api/revalidate` for near-instant product updates.
4. Expand collections / metafields for richer PDP content.
5. Use [AI_DESIGN_GUIDE.md](./AI_DESIGN_GUIDE.md) for visual iterations without touching commerce.
