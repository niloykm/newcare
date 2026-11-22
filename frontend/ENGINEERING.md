# NewCare Healthcare Engineering Standards

Mirrored from repository root `ENGINEERING.md`.

- Strict TypeScript (`ignoreBuildErrors: false`, zero `any`).
- Tailwind CSS v4 compliant (`@custom-variant dark`, no unlayered `* { margin: 0; padding: 0; }`).
- Accessible Radix UI dialogs, single `<main>` landmark, `44px` minimum interactive touch targets, field-level form validation (`aria-invalid`, `aria-describedby`).
- Coherent US Greater New York / NYS DOH / ABMS clinical data with zero broken or placeholder links.
- Verified with `tsc --noEmit`, `eslint`, `next build`, and headless Chromium at `1440x900` and `390x844`.
