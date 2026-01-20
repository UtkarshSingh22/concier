# Dark Mode Theme System

## Overview

Scaffold includes a **professional dark mode** using shadcn/ui's token-based theming. The theme system is production-ready with:

- **CSS variables** - No hardcoded colors
- **Automatic adaptation** - All components respond to theme changes
- **Persistent** - Theme saved in localStorage
- **System-aware** - Respects user's OS preference
- **Accessible** - Proper contrast ratios

---

## Architecture

### Color Variables (`app/globals.css`)

All colors use **OKLCH color space** for perceptual uniformity:

```css
:root {
  --background: oklch(1 0 0); /* Light: White */
  --foreground: oklch(0.145 0 0); /* Light: Near black */
  --primary: oklch(0.205 0 0); /* Primary action */
}

.dark {
  --background: oklch(0.145 0 0); /* Dark: Dark gray */
  --foreground: oklch(0.985 0 0); /* Dark: Near white */
  --primary: oklch(0.922 0 0); /* Primary inverted */
}
```

### Theme Provider (`ThemeProvider.tsx`)

Wraps your app in `layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/ThemeProvider";

<ThemeProvider>{children}</ThemeProvider>;
```

### Theme Toggle (`ThemeToggle.tsx`)

Add to any component:

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

<ThemeToggle />;
```

---

## Color Tokens

Always use these semantic tokens instead of hardcoded colors:

| Token              | Usage             | Example                 |
| ------------------ | ----------------- | ----------------------- |
| `background`       | Page background   | `bg-background`         |
| `foreground`       | Primary text      | `text-foreground`       |
| `card`             | Card background   | `bg-card`               |
| `card-foreground`  | Card text         | `text-card-foreground`  |
| `muted`            | Muted backgrounds | `bg-muted`              |
| `muted-foreground` | Secondary text    | `text-muted-foreground` |
| `primary`          | Primary buttons   | `bg-primary`            |
| `border`           | Borders           | `border-border`         |

---

## Usage

### ✅ Correct Usage

```tsx
// Good - uses theme tokens
<div className="bg-background text-foreground border-border">
  <p className="text-muted-foreground">Muted text</p>
</div>

<Card>
  <CardTitle>Automatically themed</CardTitle>
</Card>
```

### ❌ Avoid

```tsx
// Bad - hardcoded colors won't adapt
<div className="bg-white text-gray-900">
  <p className="text-gray-500">Text</p>
</div>
```

### Migration Guide

Replace hardcoded colors with semantic tokens:

- `bg-white` → `bg-background` or `bg-card`
- `text-gray-900` → `text-foreground`
- `text-gray-500` → `text-muted-foreground`
- `border-gray-200` → `border-border`
- `bg-gray-100` → `bg-muted`

---

## Customization

### Change Colors

Edit `app/globals.css`:

```css
:root {
  --primary: oklch(0.5 0.15 240); /* Blue */
}

.dark {
  --primary: oklch(0.7 0.15 240); /* Lighter blue */
}
```

**Tools:**

- [OKLCH Color Picker](https://oklch.com/)
- [Color.js Converter](https://colorjs.io/apps/convert/)

### Add Custom Colors

1. Add to both `:root` and `.dark`:

   ```css
   :root {
     --my-color: oklch(0.7 0.2 50);
   }
   .dark {
     --my-color: oklch(0.6 0.2 50);
   }
   ```

2. Register in `@theme inline`:

   ```css
   @theme inline {
     --color-my-color: var(--my-color);
   }
   ```

3. Use in components:
   ```tsx
   <div className="bg-my-color">Content</div>
   ```

---

## Advanced Features

### Force Theme Programmatically

```tsx
import { useTheme } from "next-themes";

const { setTheme } = useTheme();
setTheme("dark"); // or "light"
```

### Per-Section Themes

```tsx
<div className="dark">
  <Card>Always dark</Card>
</div>
```

### Add More Themes

1. Add CSS class:

   ```css
   .midnight {
     --background: oklch(0.05 0 0);
     --foreground: oklch(0.95 0 0);
   }
   ```

2. Update ThemeProvider:
   ```tsx
   themes={["light", "dark", "midnight"]}
   ```

---

## Troubleshooting

### Hydration Mismatch

Ensure `suppressHydrationWarning` on `<html>`:

```tsx
<html lang="en" suppressHydrationWarning>
```

### Colors Not Changing

1. Check for hardcoded colors (`bg-white` vs `bg-background`)
2. Verify `.dark` class on `<html>` element
3. Debug with:
   ```tsx
   const { theme, resolvedTheme } = useTheme();
   console.log({ theme, resolvedTheme });
   ```

---

## File Structure

**Core Files (🔒 DO NOT MODIFY):**

- `app/globals.css` - Color variables
- `components/ThemeProvider.tsx` - Theme context
- `components/ThemeToggle.tsx` - Toggle button
- `app/layout.tsx` - Wraps app

**Editable Files (🏗️ SAFE TO EDIT):**

- `components/Header.tsx` - UI placement
- `components/landing/LandingNav.tsx` - UI placement

---

## Resources

- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [next-themes](https://github.com/pacocoursey/next-themes)
- [OKLCH Color Space](https://oklch.com/)

**Your theme system is production-ready!** 🎨
