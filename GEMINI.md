# NewCare — Project Engineering & Design Guidelines

## 1. Domain & Regional Identity
- **Platform:** NewCare — Clinical In-Home Nursing, Caregiving, and Specialist Consultation Network.
- **Service Region & Jurisdiction:** Greater New York & Tri-State Area (United States).
- **Regulatory & Credentialing Standard:**
  - In-home care operates under New York State Licensed Home Care Services Agency (LHCSA) guidelines, HIPAA-compliant charting, and W-2 bonded staffing.
  - Physicians hold coherent US clinical credentials (`MD`, `DO`, `FACC`, `FACP`, `FAAD`, `FAAP`, `FAAN`, `FACOG`, `FAAOS`, `FACS`, `FAAFP`) verified via the New York State Department of Health / ABMS Board Certification.
  - **Strict Consistency Rule:** Never mix non-US regulatory boards (`BMDC`, `MBBS`, `FCPS`, `MRCGP`) or contradictory jurisdictions.
- **Contact & Intake Integrity:**
  - Never use placeholder phone numbers (`(800) 123-4567`, `(555) ...`), `tel:` dummy links, or dead `href="#"` anchors. Route all intake and callback actions cleanly to `/contact` or the interactive clinical assessment dialog.

## 2. Visual System (60-30-10 Clinical Standard)
- **60% Dominant Surface:** Crisp clinical light (`#F8FAFC` page canvas, `#FFFFFF` elevated surfaces) and calm dark slate (`#0B0F14` canvas, `#11161D` cards).
- **30% Structural Borders & Typography:** Hairline `1px` borders (`#E2E8F0` light / `#1E293B` dark), slate ink (`#0F172A` primary, `#475569` secondary).
- **10% Primary Accent + Semantics:** Deep Medical Teal (`#0F766E` with `#FFFFFF` foreground -> `5.47:1` WCAG AA contrast; hover `#115E59`). Semantic states for success (`#15803D`), warning (`#B45309`), and destructive (`#B91C1C`).
- **Typography:** `Inter` (primary sans) + `JetBrains Mono` (clinical IDs, pass tokens, license numbers). Apply `tabular-nums` to all hourly rates, shift totals, consultation fees, ratings, metrics, and appointment times.
- **Anti-Slop Rules:** No purple/blue gradients, neon glows, floating blobs, gratuitous glassmorphism, emojis in UI controls/headings, `"Lorem ipsum"`, placeholder names (`John Doe`), fabricated vanity counters, stacked announcement bars, or floating demo widgets.

## 3. Technical & Tailwind v4 Standards
- **Tailwind CSS v4:** Never place unlayered `* { margin: 0; padding: 0; }` resets in `globals.css` (they override `@layer utilities`). Declare `@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));` so dark mode responds cleanly to `[data-theme="dark"]`.
- **Strict TypeScript:** `ignoreBuildErrors` must remain disabled. Zero `any` types in application code. Remove wildcard module shims that hide real types.
- **Accessible Primitives:** Use `@radix-ui/react-dialog` for dialogs/modals, semantic landmarks (single `<main>` per page), explicit field-level validation with `aria-invalid` and `aria-describedby`, `min-h-[44px]` touch targets, `object-cover object-top` for clinician portraits, and `prefers-reduced-motion` support.
- **Verification:** Before completing UI work, verify `npx tsc --noEmit`, `npm run lint`, `npm run build`, and headless Chromium checks at `1440x900` and `390x844` across all core routes.
