# Project: todo-mcp

Full-stack todo app — NestJS backend, React frontend, PostgreSQL, Docker.

## Design System (PROTECTED)

The frontend uses the **"Dark Ink" Editorial Noir** design system. The full specification lives in `frontend/DESIGN_SYSTEM.md`. These rules are mandatory:

### DO NOT change:
- **Color palette**: Gold (#C9A84C) accent on matte black (#0D0D0D) background with warm ivory (#F0EDE6) text
- **Typography**: Cormorant Garamond for display (`font-display`), DM Sans for body (`font-sans`)
- **shadcn theme tokens** in `frontend/src/index.css` `:root` block — these map to the dark editorial palette
- **Custom color tokens** (`gold`, `gold-dim`, `gold-hover`, `danger`, `danger-dim`, `success`, `ivory`, `ivory-mid`, `ivory-dim`) in the `@theme` block
- **Dark-only mode**: There is no light theme. Do not add `.dark` variant or light/dark toggle.
- **Background**: Matte black with subtle noise grain texture on body

### Component rules:
- Use **shadcn/ui components** (`Card`, `Button`, `Input`, `Checkbox`, `Badge`, `Separator`, `Popover`, `Calendar`) — do not replace with custom elements
- Badges use `variant="outline"` with semantic colors: `success` for done, `danger` for overdue, `gold` for due dates
- Checkboxes turn gold when checked: `data-[state=checked]:bg-gold`
- Delete buttons use ghost variant, hidden by default, revealed on row hover via `group-hover:opacity-100`
- DatePicker uses `Popover` + `Calendar` (not native `<input type="date">`)

### When adding new UI:
- Reference `frontend/DESIGN_SYSTEM.md` for tokens, type scale, spacing, and component patterns
- Use Tailwind classes with the existing custom tokens — never introduce new color values
- Match existing animation patterns (350ms reveal, 40ms stagger, cubic-bezier easing)
- Keep the editorial aesthetic: generous whitespace, uppercase tracking labels, restrained use of color

## Tech Stack
- **Backend**: NestJS, TypeORM, PostgreSQL, class-validator
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui, TypeScript
- **Infra**: Docker Compose (PostgreSQL, backend, frontend)
- **Path alias**: `@/` maps to `frontend/src/`
