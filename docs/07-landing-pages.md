# Landing Pages

The boilerplate includes a complete landing page system with modular sections.

## Pages

| Page | Path | Purpose |
|------|------|---------|
| Homepage | `/` | Main landing page |
| Pricing | `/pricing` | Pricing table |
| Contact | `/contact` | Contact form |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |

## Homepage Sections

The homepage (`/app/page.tsx`) uses these components from `/components/landing/`:

| Component | Purpose |
|-----------|---------|
| `Hero` | Main headline and CTAs |
| `ProblemSolution` | Problem/solution cards |
| `FeatureHighlights` | Feature grid |
| `HowItWorks` | Step-by-step process |
| `CallToAction` | Final CTA section |

## File Locations

```
src/
├── app/
│   ├── page.tsx           # Homepage layout
│   ├── pricing/page.tsx   # Pricing page
│   ├── contact/page.tsx   # Contact form
│   ├── privacy/page.tsx   # Privacy policy
│   └── terms/page.tsx     # Terms of service
└── components/
    └── landing/
        ├── Hero.tsx
        ├── ProblemSolution.tsx
        ├── FeatureHighlights.tsx
        ├── HowItWorks.tsx
        ├── CallToAction.tsx
        └── index.ts
```

## Customizing the Homepage

Edit `/app/page.tsx` to change section order or remove sections:

```tsx
import { Hero, FeatureHighlights, CallToAction } from "@/components/landing";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeatureHighlights />
      {/* Removed ProblemSolution and HowItWorks */}
      <CallToAction />
      <Footer />
    </div>
  );
}
```

## Customizing Sections

Each section is a standalone component. Edit directly:

**Hero** (`/components/landing/Hero.tsx`)
- Headline text
- Subheadline
- CTA buttons
- Background styling

**Features** (`/components/landing/FeatureHighlights.tsx`)
- Feature list
- Icons (Lucide React)
- Descriptions

**Pricing** (`/app/pricing/page.tsx`)
- Plan names and prices
- Feature lists
- CTA buttons

## Footer

The footer is part of `/app/page.tsx`. Edit the links:

```tsx
<footer className="bg-gray-900 text-white py-12">
  <div className="flex space-x-6">
    <Link href="/contact">Contact</Link>
    <Link href="/privacy">Privacy Policy</Link>
    <Link href="/terms">Terms of Service</Link>
  </div>
</footer>
```

## Adding New Landing Pages

1. Create page file:
   ```
   /app/your-page/page.tsx
   ```

2. Add metadata:
   ```typescript
   import { createStaticPageMetadata } from "@/lib/seo";
   
   export const metadata = createStaticPageMetadata(
     "Page Title",
     "Page description"
   );
   ```

3. Add to sitemap (`/app/sitemap.ts`):
   ```typescript
   const staticRoutes = ["", "/pricing", "/your-page"];
   ```

## Important Notes

- Landing pages should NOT have authentication logic
- Keep landing pages separate from app functionality
- All landing components are marked 🏗️ USER EDITABLE
- The pricing page CTAs link to `/auth` for sign up

## What You Should Edit

- All files in `/components/landing/`
- `/app/page.tsx` - Homepage layout
- `/app/pricing/page.tsx` - Pricing content
- `/app/privacy/page.tsx` - Privacy policy content
- `/app/terms/page.tsx` - Terms content
- `/app/contact/page.tsx` - Contact form styling

## What NOT to Add Here

- Authentication checks
- Database queries
- User-specific content
- Business logic

Landing pages are for marketing. App logic goes in `/app/(protected)/`.

