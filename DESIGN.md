# TranscriptPro Design System

## Colors

### Light Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `#0f172a` | Primary text |
| `--primary` | `#4f46e5` | CTAs, links, focus rings |
| `--primary-dark` | `#4338ca` | Button hover |
| `--primary-light` | `#818cf8` | Subtle accents |
| `--accent` | `#06b6d4` | Highlights, badges |
| `--muted` | `#64748b` | Secondary text, captions |
| `--border` | `#e2e8f0` | Card borders, dividers |
| `--surface` | `#f8fafc` | Section backgrounds, hover |
| `--card` | `#ffffff` | Card backgrounds |

### Dark Mode
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#0b1120` | Page background |
| `--foreground` | `#f1f5f9` | Primary text |
| `--primary` | `#6366f1` | CTAs, links |
| `--primary-dark` | `#4f46e5` | Button hover |
| `--primary-light` | `#818cf8` | Subtle accents |
| `--accent` | `#22d3ee` | Highlights |
| `--muted` | `#94a3b8` | Secondary text |
| `--border` | `#1e293b` | Card borders |
| `--surface` | `#111827` | Section backgrounds |
| `--card` | `#0f172a` | Card backgrounds |

### Semantic
- **Error**: `#ef4444` (red-500), bg `#fef2f2` (red-50)
- **Warning**: `#f59e0b` (amber-500), bg `#fffbeb` (amber-50)
- **Success**: `#10b981` (green-500), bg `#ecfdf5` (green-50)

## Typography

| Level | Size | Weight | Line | Usage |
|-------|------|--------|------|-------|
| Hero | 36-60px (text-4xl→6xl) | 700 (bold) | tight | Home hero, page titles |
| H1 | 28-36px (text-2xl→3xl) | 700 (bold) | tight | Page headings |
| H2 | 20px (text-xl) | 600 (semibold) | normal | Section headings |
| H3 | 16px (text-base) | 600 (semibold) | normal | Card titles |
| Body | 14px (text-sm) | 400 | relaxed | Body text |
| Body Lg | 18px (text-lg) | 400 | relaxed | Hero description |
| Caption | 12px (text-xs) | 400 | normal | Meta text, labels |
| Mono | 14px | 400 | normal | Code, technical |

**Font stack**: Inter (sans), JetBrains Mono (mono)

## Spacing

| Context | Value |
|---------|-------|
| Page section | `py-16` to `py-20` |
| Container max-width | `max-w-6xl` (72rem) for wide, `max-w-4xl` for content, `max-w-3xl` for text |
| Container padding | `px-4 sm:px-6` |
| Card padding | `p-4` (compact), `p-6` (default), `p-8` (spacious) |
| Card gap (grid) | `gap-6` |
| Card gap (stack) | `space-y-3` to `space-y-4` |
| Section gap | `mt-12` to `mt-16` |

## Shared Components

### Card
```css
rounded-xl border border-border bg-card
```
Variants: default (p-6), compact (p-4), hover (hover:border-primary/30 hover:shadow-md)

### Button — Primary
```css
rounded-xl bg-primary text-white font-semibold px-6 py-3.5
hover:bg-primary-dark disabled:opacity-50
```

### Button — Secondary
```css
rounded-lg border border-border text-muted px-3 py-1.5
hover:text-foreground
```

### Button — Ghost
```css
rounded-lg text-muted px-3 py-1.5
hover:bg-surface hover:text-foreground
```

### Button — Danger
```css
rounded-lg border border-red-200 text-red-500 px-2.5 py-1.5
hover:bg-red-50
```

### Input
```css
rounded-xl border border-border bg-card px-4 py-3.5 text-sm text-foreground
placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20
```

### Stat Card
```css
rounded-xl border border-border p-4
```
Contains: icon + label (text-sm text-muted) + value (text-2xl font-bold)

### Empty State
```css
rounded-xl border border-border p-12 text-center text-sm text-muted
```
Contains: icon, title, description, optional CTA

### Badge
```css
rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary
```

### Divider
```css
border-t border-border
```

### Skeleton Loader
Uses `.skeleton` class — shimmer animation, for cards/text blocks use with rounded-lg

## Layout Patterns

### Page Shell
```
Header (sticky, border-b)
  └─ Main (flex-1)
       └─ Container (mx-auto max-w-* px-4 py-8 sm:px-6)
            └─ Content
Footer (border-t, bg-surface)
```

### Dashboard Layout (NEW)
```
Header (sticky)
  └─ Main
       └─ Stats bar (3-4 stat cards, grid-cols-3/4)
       └─ Toolbar (search + actions)
       └─ Content area (cards, table, or list)
       └─ Empty state (conditional)
```

### Static Page Layout
```
Header
  └─ Main
       └─ Container (max-w-3xl, py-16)
            └─ H1 + prose content
Footer
```

## States Every Page Must Handle
1. **Loading** — Skeleton cards/rows matching layout shape
2. **Empty** — Icon + title + description + CTA
3. **Error** — Red icon + message + retry button
4. **Populated** — Real data
5. **Edge cases** — Long titles, missing metadata, zero counts
