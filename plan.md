# NewCare — Healthcare & Role-Based Appointment SaaS Overhaul (`plan.md`)

**Application:** NewCare — Doctor Appointment Booking Platform (`newcare.vercel.app`)[cite: 1]  
**Stack:** Next.js, TypeScript, Tailwind CSS, Zustand, NestJS/PostgreSQL (with Local Persistence Fallback), Playwright[cite: 1]  
**Objective:** Eliminate tutorial stock assets, fix empty doctor skeleton grids, unify broken routes/filters, and showcase the Role-Based Dashboards (Patient, Doctor, Admin) and multi-step booking engine immediately[cite: 1].

---

## 1. Critical Bugs & Broken Routes to Fix Immediately

1. **Eliminate the Empty 6-Card "Top Doctors" Skeleton Grid:**
   - Currently, when the backend API is cold or unreachable, the "Top Doctors" section on `/` renders 6 empty `<div>` skeleton blocks.
   - Create a comprehensive, strongly-typed fallback dataset (`src/data/doctorsData.ts`) containing **12 realistic Doctor Profiles** across all 8 specialties (`General Physician`, `Gynecologist`, `Dermatologist`, `Pediatrician`, `Neurologist`, `Cardiologist`, `Orthopedic`, `ENT Specialist`).
   - Each doctor profile must include: `id`, `slug`, `name`, `degree` (e.g., `MBBS, FCPS (Cardiology)`), `specialty`, `experienceYears`, `hospitalName`, `rating` (`4.9`), `reviewsCount`, `consultationFee`, `avatarUrl` (high-res professional medical portrait from Unsplash), `isAvailableToday: true`, `nextAvailableSlot` (`Today, 4:30 PM`), `about`, and `weeklySlots`.
   - Wire this fallback data into the API hook/service so `/` and `/doctors` *always* render rich doctor cards instantaneously.

2. **Fix Broken & Mismatched URLs:**
   - **Footer Link Fix:** Change `<a href="/all-doctors">All Doctors</a>` in the Footer to `/doctors` to match the Navbar.
   - **Normalize Specialty Query Parameters:** Unify case and pluralization across the Specialty section, Footer, and `/doctors` filter logic (use case-insensitive matching or standardized slugs like `general-physician`, `pediatrician`, `cardiologist`, etc.) so clicking any specialty link filters correctly every time.
   - **Fix Duplicate Step Numbers:** In the "How NewCare Works" section, remove the duplicated `<div>01</div><div>01</div>` DOM nodes and style a single clean step badge.

3. **Replace Recognizable Tutorial Stock Assets (`header_img.png` & `group_profiles.png`):**
   - Replace the stock tutorial hero image and generic boilerplate text (*"Simply browse through our extensive list of trusted doctors..."*) with an authentic **Zocdoc / One Medical** clinical aesthetic:
     - Left Column: Trust badge (`Verified Clinical Network • Instant Video & In-Clinic Booking`), bold headline, and an **Interactive Quick-Finder Bar** (Specialty Dropdown + Consultation Type `In-Person / Video Call` + Date Picker + `"Find Available Doctors"` button).
     - Right Column: An interactive **Live Appointment Preview Card** showing a verified specialist card, real-time selectable time slots (`10:30 AM`, `02:00 PM`, `04:30 PM`), and a live `"⚡ Book in 3 Clicks"` interactive demo trigger.

---

## 2. Showcase the Resume Highlights: Role-Based Dashboards & Multi-Step Booking

Your resume specifically claims:
> *"Engineered role-based Admin, Doctor, and Patient dashboards with multi-step appointment scheduling and Zustand state management."*[cite: 1]

To prove this to recruiters within 10 seconds of visiting the site:

### A. 1-Click Role Switcher / Demo Bar (`DemoRoleSwitcher.tsx`)
- Add a sleek, high-craft floating or top-bar **"⚡ Interactive Demo Mode"** pill allowing visitors to switch views without typing credentials:
  1. **`👤 Patient View`** (Book multi-step appointments, manage upcoming visits, download appointment confirmation slip)[cite: 1]
  2. **`🩺 Doctor Dashboard`** (`/dashboard/doctor` — View today's patient queue, accept/reschedule slots, update availability calendar, add consultation notes)[cite: 1]
  3. **`🛡️ Admin Portal`** (`/dashboard/admin` — View total clinic revenue, appointment volume analytics, manage verified doctors, and monitor RBAC user statuses)[cite: 1]

### B. Multi-Step Appointment Booking Drawer / Page (`/doctors/[id]`)[cite: 1]
- Clicking any doctor card opens a rich Doctor Profile & Multi-Step Booking Experience managed by **Zustand**[cite: 1]:
  - **Step 1: Consultation Type & Slot Selection** (Choose `In-Clinic Visit` or `HD Video Consultation`, pick Date & available 30-minute Time Slot).
  - **Step 2: Patient Details & Symptoms** (Pre-filled in Demo Mode or quick input for Patient Name, Age, Reason for Visit / Symptoms tags).
  - **Step 3: Instant Confirmation & Digital Appointment Pass** (Generates a confirmed Booking ID, QR check-in code, calendar export button, and immediately adds the appointment to the Zustand store so it appears in the Patient, Doctor, and Admin dashboards!).

### C. Upgraded Doctor Cards (`DoctorCard.tsx`)
Every doctor card on `/` and `/doctors` must display:
- High-res portrait image with a live status pill (`🟢 Available Today` or `Next: Tomorrow 10 AM`)
- Specialty Pill + Verified Medical License checkmark (`✓ BMDC / Board Verified`)
- Doctor Name, Credentials (`MBBS, MD`), and Hospital/Clinic name
- Rating (`★ 4.9 (128 reviews)`), Experience (`12+ Yrs`), and Fee (`$40 / ৳1,000`)
- Direct `"Book Slot →"` button showing the next 2 available time pills right on the card.

---

## 3. Page-by-Page Verification Checklist

1. **`/` (Landing Page):** Interactive Hero search + live slot preview card, unified Specialty explorer with clean SVG medical icons, 6 populated Top Doctor cards (zero empty skeletons), clean 3-step clinical workflow, and an interactive preview of the Role-Based Dashboards[cite: 1].
2. **`/doctors` (All Doctors Directory):** Instant client-side filtering by Specialty (case-insensitive), Availability (`Available Today`), Consultation Type (`Video` / `In-Person`), Sort by Rating/Experience/Fee, and search by Doctor Name.
3. **`/doctors/[id]` (Doctor Profile & 3-Step Booking):** Complete multi-step Zustand booking flow that persists new appointments into Zustand (`localStorage` persisted)[cite: 1].
4. **`/dashboard/patient`, `/dashboard/doctor`, `/dashboard/admin` (or unified `/dashboard` with Role Tabs):** Fully populated, interactive role-based dashboards with realistic appointments, status toggles (`Confirmed`, `Completed`, `Cancelled`), and clinic metrics[cite: 1].
5. **`/about` & `/contact`:** Clean, cohesive clinical UI with working contact form feedback and zero dead `#` links.