# NewCare Healthcare Engineering Standards

- **Strict TypeScript:** `typescript.ignoreBuildErrors` must be `false`. Zero `any` types across components, hooks, stores, and API mappers.
- **Tailwind CSS v4 Integrity:** Never add unlayered global `* { margin: 0; padding: 0; }` resets. Define `@custom-variant dark` for `[data-theme="dark"]` so manual theme toggling syncs CSS custom properties and Tailwind `dark:` utilities seamlessly.
- **Accessible UI Primitives:** Use `@radix-ui/react-dialog` for modals with keyboard focus management and Escape dismissal. Enforce single `<main>` landmark per page and `min-h-[44px]` touch targets on primary interactive controls.
- **Form Validation:** Validate all intake, contact, booking, and auth forms with typed field-level validation, explicit inline error messages, `aria-invalid`, and `aria-describedby`.
- **Consistent Clinical Identity:** All physician profiles, licenses, and copy adhere to US (Greater New York / NYS DOH / ABMS) standards with zero broken links (`about:invalid`, `href="#"`, or dummy `tel:` links).
- **Verification Gate:** Every release must pass `npx tsc --noEmit`, `npm run lint`, `npm run build`, and Playwright browser QA at `1440x900` and `390x844` with zero console errors, zero broken links, and zero horizontal overflow.
