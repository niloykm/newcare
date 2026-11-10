# HEALTHCARE ENGINEERING STANDARDS

- Strict TypeScript: No `any` types. Strict typing on all caregiver, booking, and service interfaces.
- Component Architecture: Clean separation between presentation wrappers (Server Components) and interactive form/calendar state (Client Components).
- Form Handling & Validation: Robust input validation (Zod + React Hook Form), explicit error states below fields, and accessible screen-reader tags (`aria-invalid`, `aria-describedby`).
- Mobile First: Zero horizontal overflow (`overflow-x`). Tap targets on buttons/inputs minimum 44px for accessibility.
