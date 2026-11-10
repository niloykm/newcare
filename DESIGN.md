# NEWCARE UI/UX DESIGN SYSTEM

## 1. Trust, Palette & Contrast
- Palette: Trustworthy, high-clarity clinical palette.
  - Base: Crisp light backgrounds (`#ffffff`, subtle `#f8fafc` slate-50) or deep, calm neutral dark surfaces (`#09090b` zinc-950).
  - Primary Accent: Deep clinical teal or medical navy (`#0d9488` teal-600 or `#0284c7` sky-600), never bright neon violet or saturated magenta.
  - Status tokens: Success (`#16a34a`), Alert (`#ea580c`), Info (`#0284c7`).
- Borders: Crisp, ultra-clean dividers (`border-slate-200 dark:border-zinc-800`). Avoid heavy, blurry AI drop shadows.
- Surface Geometry: Clean, disciplined radii (`rounded-lg` 8px for cards, `rounded-md` 6px for buttons/inputs). No bloated `rounded-3xl` cards.

## 2. Typography & Spatial Rhythm
- Headings: `font-semibold tracking-tight text-slate-900 dark:text-zinc-50`.
- Body: High-contrast legible text (`text-slate-600 dark:text-zinc-400`), strictly WCAG AAA compliant for healthcare readability.
- Layout Spacing: Tighten rhythm to 4px/8px increments. Maximum container widths capped at `max-w-6xl` or `max-w-7xl` to prevent content islands stranded in empty whitespace.

## 3. Interactive Healthcare Affordances
- High-touch interactive elements: Forms, booking steps, and filters must have obvious `:hover`, `:focus-visible`, and active states.
- Reassuring microcopy: State transparent turnaround times, cancellation policies, and emergency protocols next to action buttons.
