# Design System — "Dark Ink" Editorial Noir

This document is the single source of truth for the todo-mcp frontend visual identity.
**Do not change these values** without explicit user approval.

---

## Aesthetic Direction

**Tone:** Dark luxury editorial — sophisticated, calm, intentional.
Like a high-end stationery brand's digital product.

**Signature elements:**
- Matte black background with warm ivory text
- Gold accent for interactive/primary elements
- Dramatic light-weight serif for display, clean geometric sans for body
- Subtle paper-grain noise texture on background
- Staggered reveal animations on list items

---

## Color Palette

### Custom Tokens (`@theme`)

| Token           | Hex       | Usage                            |
|-----------------|-----------|----------------------------------|
| `gold`          | `#C9A84C` | Primary accent, buttons, links   |
| `gold-dim`      | `#8A7433` | Gold in muted contexts           |
| `gold-hover`    | `#D4B656` | Button hover state               |
| `danger`        | `#D4564E` | Errors, overdue, destructive     |
| `danger-dim`    | `#7A3330` | Danger in muted contexts         |
| `success`       | `#5CAA6E` | Completed, done badges           |
| `ivory`         | `#F0EDE6` | Primary text (warm white)        |
| `ivory-mid`     | `#A8A299` | Secondary text                   |
| `ivory-dim`     | `#5C5850` | Muted/disabled text              |

### shadcn Semantic Tokens (`:root`)

| Token                | OKLCH Value            | Maps To        |
|----------------------|------------------------|----------------|
| `--background`       | `oklch(0.07 0 0)`     | Matte black    |
| `--foreground`       | `oklch(0.93 0.005 80)`| Warm ivory     |
| `--card`             | `oklch(0.11 0 0)`     | Dark card bg   |
| `--primary`          | `oklch(0.72 0.1 85)`  | Gold           |
| `--primary-foreground`| `oklch(0.07 0 0)`    | Black on gold  |
| `--secondary`        | `oklch(0.14 0 0)`     | Hover bg       |
| `--muted`            | `oklch(0.18 0 0)`     | Subtle bg      |
| `--muted-foreground` | `oklch(0.5 0.005 60)` | Dim text       |
| `--accent`           | `oklch(0.72 0.1 85)`  | Gold           |
| `--destructive`      | `oklch(0.6 0.2 25)`   | Danger red     |
| `--border`           | `oklch(0.2 0 0)`      | Subtle divider |
| `--ring`             | `oklch(0.72 0.1 85)`  | Gold focus ring|
| `--radius`           | `0.625rem`            | Base radius    |

**Important:** This is a dark-only theme. There is no `.dark` variant — the `:root` values are already dark.

---

## Typography

| Role          | Font Family                       | Tailwind Class  |
|---------------|-----------------------------------|-----------------|
| **Display**   | Cormorant Garamond (300, 400, 600, 700) | `font-display` |
| **Body/Sans** | DM Sans (300, 400, 500, 700)      | `font-sans` / `font-body` |

### Type Scale

| Element        | Size                           | Weight | Tracking   |
|----------------|--------------------------------|--------|------------|
| Page title     | `clamp(42px, 10vw, 64px)`     | 300    | `tight`    |
| Body text      | `14px` (`text-sm`)             | 400    | default    |
| Labels/caps    | `10–11px`                      | 500    | `0.15–0.2em` uppercase |
| Empty state    | `18px` (`text-lg`)             | 300    | `wide`, italic, `font-display` |

---

## Component Conventions

### shadcn Components Used

| Component     | Usage                                      |
|---------------|--------------------------------------------|
| `Card`        | Main content container                     |
| `Button`      | Add button (gold bg), Clear, Delete (ghost)|
| `Input`       | Title text input (borderless, transparent) |
| `Checkbox`    | Todo completion toggle (gold when checked) |
| `Badge`       | Status tags — Done (green), Overdue (red), Due date (gold) |
| `Separator`   | Dividers between form rows, gold accent bar|
| `Popover`     | DatePicker container                       |
| `Calendar`    | Date selection in DatePicker               |

### Checkbox Styling
```
className="border-muted-foreground data-[state=checked]:bg-gold data-[state=checked]:border-gold data-[state=checked]:text-background"
```

### Badge Variants (all use `variant="outline"`)
- **Done:** `border-success/30 bg-success/10 text-success`
- **Overdue:** `border-danger/30 bg-danger/10 text-danger`
- **Due date:** `border-gold/30 bg-gold/8 text-gold`

Common badge classes: `text-[10px] tracking-widest uppercase`

### Button Variants
- **Primary (Add):** `bg-gold text-background hover:bg-gold-hover`, bold, uppercase, tracking
- **Ghost (Delete):** Hidden by default, `opacity-0 group-hover:opacity-100`, `hover:text-danger`
- **Ghost (Clear):** `text-muted-foreground hover:text-danger`

---

## Layout

- Page max-width: `max-w-140` (560px)
- Page padding: `px-5 pt-14 pb-24`
- Card: `rounded-xl border border-border overflow-hidden`
- List item padding: `px-5 py-3.5`
- Form input padding: `px-5 py-4`

---

## Animation

| Animation | Duration | Easing                           | Usage       |
|-----------|----------|----------------------------------|-------------|
| `reveal`  | 350ms    | `cubic-bezier(0.22, 1, 0.36, 1)` | List items  |
| Stagger   | +40ms per item | via `animationDelay`        | List items  |
| Hover     | 200ms    | `ease` (default)                 | Rows, buttons|

---

## Background

Subtle noise grain texture applied to `body` via inline SVG:
```css
background-image: url("data:image/svg+xml,...feTurbulence...opacity='0.025'...");
```

---

## File Structure

```
frontend/src/
├── index.css                  # All tokens, theme, base styles, animations
├── components/
│   ├── ui/                    # shadcn components (DO NOT manually edit)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── date-picker.tsx    # Custom: Popover + Calendar combo
│   │   ├── input.tsx
│   │   ├── popover.tsx
│   │   └── separator.tsx
│   ├── AddTodo.tsx
│   ├── TodoItem.tsx
│   └── TodoList.tsx
├── hooks/
│   └── useTodos.ts
├── lib/
│   └── utils.ts               # shadcn cn() utility
├── App.tsx
└── main.tsx
```
