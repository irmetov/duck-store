# AI Design Guide — Duck Donuts Storefront

This project separates **commerce** from **visual design** so Cursor agents can redesign the store without breaking Shopify.

## Typography (Adobe Fonts)

Kit: `https://use.typekit.net/yki4nse.css` (loaded in `app/layout.tsx`)

| Role | Font | Token / component |
|------|------|-------------------|
| Headlines | Degular Black (weight 800 in kit) | `--font-heading`, `Heading` |
| Subtitles | Eldwin Script Black (900) | `--font-subtitle`, `Subtitle` |
| Body | Degular Regular | `--font-body`, `Text` |

Logo: `public/images/duckdonuts-logo.svg` (`currentColor` fill — inherits text color)

- Theme tokens in `styles/theme.css` and `app/globals.css`
- `lib/theme/theme-config.ts`, `theme-types.ts`, `theme-utils.ts`
- Shared UI in `components/ui/*`
- Layout chrome in `components/layout/*`
- Product cards, grids, gallery styling in `components/commerce/*` (visual only)
- Homepage composition in `config/homepage.ts`
- Section components in `components/sections/*`
- Typography, spacing, colors, radii, shadows, motion
- Header / footer / cart drawer appearance
- Image aspect ratios and product grid column presets
- Brand copy in `config/store.ts` and `config/navigation.ts`

## Do not change without an explicit request

- `lib/shopify/client.ts`
- `lib/shopify/queries.ts`
- `lib/shopify/mutations.ts`
- `lib/shopify/cart.ts`, `cart-actions.ts`, `cookies.ts`
- Variant selection business rules that gate availability / sold-out
- Checkout redirect to Shopify hosted checkout
- Environment variable names and credential handling
- Caching / revalidation strategy (`tags`, `revalidate`, `app/api/revalidate`)
- Shopify product handles / IDs used as identifiers
- Seed script Admin API mutations unless asked to change catalog tooling

## Example redesign prompt

```text
Redesign the storefront while keeping Duck Donuts brand energy (playful, colorful).

Keep all Shopify integration, product fetching, variants, cart mutations,
checkout logic, caching and routes unchanged.

Update only:
- design tokens;
- typography;
- spacing;
- shared UI components;
- product cards;
- header and footer;
- homepage composition;
- product page layout;
- cart drawer styling.

Use Buttercream / Sky / Sweetness surfaces, Playful navy text, Frost blue CTAs,
Lemon Sunshine highlights, generous rounded corners, and soft playful motion.

Do not introduce new dependencies unless absolutely necessary.
```

## Safe-to-redesign file list

```text
styles/theme.css
app/globals.css
lib/theme/*
config/store.ts
config/navigation.ts
config/homepage.ts
components/ui/*
components/layout/*
components/sections/*
components/commerce/product-card.tsx
components/commerce/product-grid.tsx
components/commerce/product-gallery.tsx
components/commerce/cart-drawer.tsx
components/commerce/collection-card.tsx
public/images/*
```
