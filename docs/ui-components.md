# UI Components

This project uses Shadcn/ui as the design system foundation. All components are built with Tailwind CSS and follow consistent patterns for styling, accessibility, and theming.

## Component Organization

### Core UI Components (`/components/ui/`)
Standard Shadcn/ui components that provide the design system foundation. These are generated using the Shadcn CLI and follow their conventions.

**Files you should NOT modify:**
- `button.tsx`, `input.tsx`, `card.tsx`, etc.
- These are the atomic building blocks

**When to modify core components:**
- Only for critical design system changes that affect your entire app
- When adding company-specific variants (see below)
- Always test thoroughly - these affect the entire application

### Custom Components (`/components/`)
Application-specific components that use the core UI components.

**Files marked as USER EDITABLE:**
- Safe to customize for your product
- Examples: `FeatureGate.tsx`, `Header.tsx`, `UpgradeButton.tsx`

**Product Components (`/components/product/`):**
- Your custom business logic components
- Completely safe to modify/replace
- Examples: dashboard widgets, forms, specialized UI

### Landing Components (`/components/landing/`)
Marketing and landing page components. Replace these with your own branding and messaging.

## Shadcn Usage Patterns

### Component Variants
All Shadcn components use `class-variance-authority` (CVA) for variants:

```typescript
import { Button } from "@/components/ui/button";

// Standard variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Size variants
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

### Styling Conventions

#### Colors
Use semantic color tokens, not hardcoded colors:
```typescript
// ✅ Good - semantic colors
className="text-foreground bg-card border-border"

// ❌ Bad - hardcoded colors
className="text-gray-900 bg-white border-gray-200"
```

#### Spacing
Use Tailwind's spacing scale consistently:
```typescript
// ✅ Consistent spacing
className="p-4 gap-3"

// ❌ Inconsistent values
className="p-5 gap-2.5"
```

#### Layout
Prefer flexbox and grid over manual positioning:
```typescript
// ✅ Flexbox patterns
className="flex items-center justify-between"
className="grid grid-cols-2 gap-4"
```

### Adding New Components

#### For Core UI Extensions
```bash
# Add a new Shadcn component
npx shadcn@latest add [component-name]
```

#### For Custom Components
Create in the appropriate directory:

```typescript
// /components/product/MyComponent.tsx
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  className?: string;
  children: React.ReactNode;
}

export function MyComponent({ className, children }: MyComponentProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4", className)}>
      {children}
    </div>
  );
}
```

## Theming & Dark Mode

### CSS Variables
The design system uses CSS variables defined in `globals.css`:

```css
/* Available in all components */
--background
--foreground
--card
--border
--primary
--secondary
/* ... etc */
```

### Dark Mode Classes
Components automatically support dark mode through the `dark:` prefix:

```typescript
className="bg-background text-foreground dark:bg-gray-900 dark:text-white"
```

### Theme Toggle
Use the existing `ThemeToggle` component for user theme switching.

## Component Patterns

### Feature Gates
Wrap premium features with the `FeatureGate` component:

```typescript
import { FeatureGate } from "@/components/FeatureGate";

<FeatureGate entitlement="pro_features">
  <PremiumFeature />
</FeatureGate>
```

### Loading States
Use consistent loading patterns:

```typescript
import { Loader2 } from "lucide-react";

<div className="flex items-center justify-center p-8">
  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
</div>
```

### Form Components
Combine UI components for forms:

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button>Submit</Button>
</div>
```

## Do's and Don'ts

### ✅ Do
- Use semantic color tokens (`text-foreground`, `bg-card`)
- Follow component variant patterns
- Test components in both light and dark modes
- Use the `cn()` utility for conditional classes
- Keep component interfaces clean and typed
- Use Lucide icons for consistency

### ❌ Don't
- Hardcode colors or spacing values
- Create custom CSS files (use Tailwind classes)
- Modify core UI components without thorough testing
- Mix different icon libraries
- Create components that don't work in dark mode
- Use inline styles instead of Tailwind classes

## Adding Custom Variants

To add company-specific variants to core components:

```typescript
// In a core component file (modify carefully)
const buttonVariants = cva(
  // existing variants...
  variants: {
    variant: {
      // existing variants...
      company: "bg-blue-600 text-white hover:bg-blue-700",
    },
  }
);
```

## Icon Usage

All icons come from Lucide React:

```typescript
import { CheckCircle, AlertTriangle, Loader2 } from "lucide-react";

<CheckCircle className="h-4 w-4" />
```

Icon sizes follow the design system:
- `h-4 w-4` (16px) - Small
- `h-5 w-5` (20px) - Medium/default
- `h-6 w-6` (24px) - Large
