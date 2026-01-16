# SEO

The boilerplate includes SEO utilities for metadata, sitemaps, and robots.txt.

## Key Files

| File              | Purpose                    |
| ----------------- | -------------------------- |
| `/lib/seo.ts`     | SEO helpers and defaults   |
| `/app/sitemap.ts` | Dynamic sitemap generation |
| `/app/robots.ts`  | Robots.txt configuration   |

## SEO Defaults

Edit defaults in `/lib/seo.ts`:

```typescript
export const seoDefaults = {
  siteName: "Your SaaS Name",
  title: {
    default: "Your SaaS Name",
    template: "%s | Your SaaS Name",
  },
  description: "Your app description...",
  url: process.env.NEXT_PUBLIC_APP_URL,
  ogImage: {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "Your SaaS Name",
  },
  twitter: {
    handle: "@yourhandle",
    site: "@yourhandle",
    cardType: "summary_large_image",
  },
};
```

## Adding Page Metadata

Use the helper functions:

```typescript
import { createStaticPageMetadata, createPageMetadata } from "@/lib/seo";

// For static pages (pricing, about, etc.)
export const metadata = createStaticPageMetadata(
  "Pricing",
  "View our pricing plans"
);

// For custom metadata
export const metadata = createPageMetadata("Page Title", "Description", {
  noindex: true, // Don't index this page
});
```

## Sitemap

The sitemap at `/app/sitemap.ts` generates `/sitemap.xml`.

Current public routes:

- `/` (homepage)
- `/pricing`

To add more routes:

```typescript
const staticRoutes = ["", "/pricing", "/about", "/blog"];
```

Private routes (`/auth`, `/billing`, `/product`) are excluded.

## Robots.txt

The robots.txt at `/app/robots.ts` controls crawler access.

Currently:

- **Allowed**: `/`, `/pricing`
- **Disallowed**: `/auth`, `/billing`, `/product`, `/api/`

To modify:

```typescript
return {
  rules: {
    userAgent: "*",
    allow: ["/", "/pricing", "/about"],
    disallow: ["/auth", "/billing", "/product", "/api/"],
  },
  sitemap: `${baseUrl}/sitemap.xml`,
};
```

## Open Graph Images

Add images to `/public/`:

- `og-image.jpg` - Default OG image (1200x630px)
- `og-homepage.jpg` - Homepage specific (optional)

Reference in metadata:

```typescript
export const metadata = createHomeMetadata({
  openGraph: {
    images: [
      {
        url: "/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Your SaaS description",
      },
    ],
  },
});
```

## Environment Variable

```
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

This is used for canonical URLs and sitemap generation.

## What You Should Edit

- `seoDefaults` in `/lib/seo.ts` - Your site name, description, Twitter handle
- `/app/sitemap.ts` - Add your public routes
- `/app/robots.ts` - Adjust crawler rules
- Add OG images to `/public/`

## What NOT to Change

- The helper function signatures in `/lib/seo.ts`
- The metadata generation logic
