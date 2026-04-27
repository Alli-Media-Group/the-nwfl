# NWFL Design Guidelines

> Single source of truth for all UI decisions.
> Read this before building or modifying any section.

---

## 1. Design Fidelity Rule

**Priority order when making a design decision:**

1. Figma design file → match it as closely as possible
2. Established app style (colors, gradients, card patterns already in the codebase)
3. Nothing else — do not pull from generic web trends or assumptions

If a section exists in Figma → replicate it.
If a section does NOT exist in Figma → derive from the app's existing visual language (dark purple background, gradient accents, glass cards). Never invent from scratch.

---

## 2. Color Palette

All colors are defined as CSS custom properties in `src/styles/_variables.scss`.
**Never use raw hex values in component files.**

| Token                  | Value     | Usage                                      |
|------------------------|-----------|--------------------------------------------|
| `--color-bg`           | `#000000` | Page background — pure black (from Figma footer/base) |
| `--color-primary`      | `#4B1FA3` | Primary UI purple, section backgrounds     |
| `--color-accent`       | `#6A2BD9` | Hover states, streaks, mid-tone accents    |
| `--color-highlight`    | `#8A3DFF` | CTA elements, glows, active states         |
| `--color-white`        | `#ffffff` | Primary text on dark backgrounds           |
| `--color-off-white`    | `#f0e6ff` | Secondary text, captions                   |
| `--color-muted`        | `#a78fbf` | Inactive nav links, placeholders           |
| `--color-border`       | `rgba(138,61,255,0.25)` | Card borders, dividers        |
| `--color-surface`      | `rgba(75,31,163,0.15)`  | Glass card backgrounds        |
| `--color-surface-2`    | `rgba(106,43,217,0.2)`  | Hover surface, badge bg       |
| `--color-success`      | `#22c55e` | Qualified / positive status                |
| `--color-danger`       | `#ef4444` | Relegated / negative status                |
| `--color-warning`      | `#f59e0b` | Caution indicators                         |

### Gradient Tokens

| Token                  | Usage                                      |
|------------------------|--------------------------------------------|
| `--gradient-hero`      | Hero section background                    |
| `--gradient-primary`   | Full-page deep background blends           |
| `--gradient-card`      | Card backgrounds                           |
| `--gradient-glow`      | Buttons, active indicators, highlighted text |

---

## 3. Typography

### Rules
- **Headings (h1–h6):** `Montserrat`, weight `700`. Always uppercase or title-case depending on context. Never change the font family.
- **Body / UI copy:** `Poppins`, weight `400` for regular text, `600` for labels/subheadings.
- **Buttons:** `Poppins`, weight `600`, uppercase, `letter-spacing: 0.04em`.
- **Table data / numbers:** `Poppins`, weight `500` (medium).
- **Badges / status text:** `Poppins`, weight `700`, uppercase, small.

### Scale (CSS tokens)

| Token        | Value                         | Usage                    |
|--------------|-------------------------------|--------------------------|
| `--fs-hero`  | `clamp(3rem, 7vw, 6rem)`      | Hero headline            |
| `--fs-4xl`   | `3.5rem`                      | Section hero titles      |
| `--fs-3xl`   | `2.5rem`                      | Section headings         |
| `--fs-2xl`   | `2rem`                        | Card / block headings    |
| `--fs-xl`    | `1.5rem`                      | Sub-section headings     |
| `--fs-lg`    | `1.25rem`                     | Large body, card titles  |
| `--fs-md`    | `1.125rem`                    | Medium body              |
| `--fs-base`  | `1rem`                        | Default body copy        |
| `--fs-sm`    | `0.875rem`                    | Captions, nav links      |
| `--fs-xs`    | `0.75rem`                     | Badges, labels           |

---

## 4. Spacing

All spacing uses `--sp-*` tokens. No hardcoded `px` values in component SCSS.

| Token          | Value   |
|----------------|---------|
| `--sp-xs`      | 0.25rem |
| `--sp-sm`      | 0.5rem  |
| `--sp-md`      | 1rem    |
| `--sp-lg`      | 1.5rem  |
| `--sp-xl`      | 2rem    |
| `--sp-2xl`     | 3rem    |
| `--sp-3xl`     | 4rem    |
| `--sp-section` | 5rem    |

Section vertical padding: always `padding-block: var(--sp-section)` via the `.section` class or the `section-padding` mixin.

---

## 5. Layout

- Max page width: `var(--max-width)` → `1280px`
- Horizontal padding: `var(--sp-lg)` on mobile, `var(--sp-2xl)` on `≥768px`
- Use the `.container` class or `@include m.container` mixin — never set `max-width` manually.
- Navbar height: `var(--navbar-height)` → `72px`. Main content gets `padding-top: var(--navbar-height)` via `RootLayout`.

### Breakpoints (in `_mixins.scss`)

| Mixin         | Min-width |
|---------------|-----------|
| `@include sm` | 480px     |
| `@include md` | 768px     |
| `@include lg` | 1024px    |
| `@include xl` | 1280px    |

Always mobile-first. Add `@include md` / `@include lg` overrides inside component SCSS.

---

## 6. Component Patterns

### Cards
- Background: `var(--gradient-card)`
- Border-radius: `var(--radius-md)` → `12px`
- Border: `1px solid var(--color-border)` + `box-shadow: var(--shadow-card)`
- Hover: `transform: translateY(-4px)` + `box-shadow: var(--shadow-glow)`
- Use the `.card` global class or the `@include m.glow-border` mixin.

### Buttons
Three variants — always use `.btn` + modifier:
- `.btn--primary` → **purple gradient fill** (`--gradient-glow`), `--radius-sm` (6px) corners — not pill, not solid color. Replaces the original red/orange CTA from the design.
- `.btn--outline` → transparent, highlight border, surface bg on hover
- `.btn--ghost` → surface bg, no border

**Never use a solid flat color for `.btn--primary`.** Always use the gradient. Never use `--radius-pill` on buttons.

### Glass Surfaces
For navbar, modals, overlays:
- `@include m.glass` → `background: var(--color-surface)` + `backdrop-filter: blur(12px)` + border

### Tables (Standings)
- Background: surface-level dark, alternating rows subtle
- Header: `var(--color-primary)` background, white bold text
- Qualified rows: left border or badge in `--color-success`
- Relegated rows: left border or badge in `--color-danger`
- Font: `Poppins 500` for data, `Poppins 700` for headers

### Badges
Use `.badge` + modifier:
- `.badge--success` → green tint (qualified)
- `.badge--danger` → red tint (relegated)
- `.badge--accent` → purple tint (general)

---

## 7. Figma Reference Notes

The Figma design covers the landing page layout. Key sections observed:

- **Hero** — full-width, dark gradient background, large heading, subtitle, CTA button
- **League Standing** — two-column table (Group A / Group B), dark background, colored status indicators
- **Media Gallery** — grid of image cards
- **News / Articles** — card grid with thumbnail, title, date, read-more link

Sections NOT in Figma must be built using this design language, not invented from external references.

---

## 8. What Not To Do

- Do not use raw hex values in component SCSS files
- Do not use `px` for spacing — use `--sp-*` tokens
- Do not use any font family other than Montserrat (headings) or Poppins (body)
- Do not set heading weight below 700
- Do not invent new color tokens — extend `_variables.scss` if genuinely needed and document here
- Do not build outside the defined page scope (Home, Stats, Analytics)
- Do not add inline styles to JSX
- Do not use CSS-in-JS
