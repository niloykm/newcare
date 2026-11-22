# NewCare UI/UX Design System

## 1. Domain Classification & Reference Standard
- **Domain:** Clinical Healthcare — In-Home Nursing, Caregiving, and Board-Certified Specialist Consultations (Greater New York & Tri-State).
- **Visual Direction:** Calm, high-trust clinical clarity inspired by modern healthcare systems (clear visual hierarchy, generous whitespace, scannable pricing, zero marketing gimmicks).

## 2. 60-30-10 Color System & WCAG AA Contrast
- **60% Dominant Surfaces:**
  - Light canvas: `#F8FAFC` (`--bg-canvas`), elevated card surface: `#FFFFFF` (`--bg-surface`).
  - Dark canvas: `#0B0F14` (`--bg-canvas`), elevated card surface: `#11161D` (`--bg-surface`).
- **30% Structural Chrome & Ink:**
  - Hairline borders: `#E2E8F0` light / `#1E293B` dark (`--border`).
  - Primary text: `#0F172A` light / `#F8FAFC` dark (`>= 12:1` contrast).
  - Secondary text: `#475569` light / `#94A3B8` dark (`>= 5.7:1` contrast).
- **10% Single Primary Accent + Semantic States:**
  - Primary clinical accent: `#0F766E` (`teal-700`, `5.47:1` contrast with `#FFFFFF` text), hover `#115E59` (`teal-800`). Dark mode accent: `#2DD4BF` (`teal-400`) with `#042F2E` ink (`> 10:1` contrast).
  - Semantic tokens: Success (`#15803D`), Warning (`#B45309`), Destructive (`#B91C1C`), Info (`#0369A1`).

## 3. Typography, Spacing & Surface Geometry
- **Fonts (2 max):** `Inter` for headings and body copy (`1.5–1.6` line-height); `JetBrains Mono` for booking IDs, license numbers, and confirmation tokens.
- **Tabular Numerals:** Required (`tabular-nums`) on all hourly rates, weekly totals, consultation fees, appointment times, ratings, and dashboard KPIs.
- **Spacing Rhythm:** Strict 4px/8px grid; section vertical rhythm `py-16 md:py-24`; max container width `1200px` (`max-w-6xl` / `.container`).
- **Radii & Borders:** Disciplined `8px` (`rounded-lg`) for cards/panels, `6px` (`rounded-md`) for buttons/inputs, subtle 1px hairline borders, minimal structural elevation.
- **Portraits:** All clinician and patient avatars MUST use `object-cover object-top` to prevent head cropping.

## 4. Navigation, Hierarchy & Anti-Slop Bans
- **Header:** Single sticky navigation bar with 5 concise links (`Services`, `Specialists`, `Portals`, `About`, `Contact`), theme toggle, account/sign-in link, and 1 primary CTA (`Book Care`). Zero announcement bars or floating corner widgets.
- **Bans:** No purple/indigo gradients, neon glows, floating blobs, gratuitous glassmorphism, emojis in UI headings/buttons, `"Lorem ipsum"`, `John Doe`, fake `(800) 123-4567` phone numbers, or repetitive pill-badge spam.
- **Motion:** Crisp `200ms` color/border/shadow transitions, respecting `@media (prefers-reduced-motion: reduce)`.
