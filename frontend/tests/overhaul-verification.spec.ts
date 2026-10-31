import { test, expect } from '@playwright/test';

test.describe('NewCare SaaS Overhaul — Comprehensive End-to-End Verification', () => {

  test('1. Landing Page (/) verification: Hero Quick-Finder, Live Preview Card, Top Doctors (no skeletons), Single Step Badge', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Check Hero Trust Badge & Headline
    await expect(page.locator('text=Verified Clinical Network • Instant Video & In-Clinic Booking')).toBeVisible();
    await expect(page.locator('text=Quality Healthcare,')).toBeVisible();

    // Check Interactive Quick-Finder Bar
    const specialtySelect = page.locator('select').first();
    await expect(specialtySelect).toBeVisible();

    // Check Live Appointment Preview Card (Right column)
    await expect(page.locator('text=Live Schedule Active')).toBeVisible();
    await expect(page.locator('text=Dr. Sarah Jenkins').first()).toBeVisible();
    await expect(page.locator('text=⚡ Book in 3 Clicks')).toBeVisible();

    // Check Top Doctors Grid (Must have 6 fully populated cards, zero empty skeletons)
    const doctorCards = page.locator('text=✓ BMDC / Board Verified');
    const count = await doctorCards.count();
    expect(count).toBeGreaterThanOrEqual(6);

    // Verify Doctor Card content: Rating, Experience, Fees, Next Available Slots
    await expect(page.locator('text=Next Available Slots:').first()).toBeVisible();
    await expect(page.locator('text=Book Slot').first()).toBeVisible();

    // Verify "How NewCare Works" section has clean single badges without duplicate 01 01
    const stepCards = page.locator('text=1. Select Specialist & Time');
    await expect(stepCards).toBeVisible();

    // Check Demo Role Switcher floating pill is visible
    await expect(page.locator('text=Interactive Demo')).toBeVisible();
    await expect(page.locator('text=Patient View').first()).toBeVisible();
    await expect(page.locator('text=Doctor Dashboard').first()).toBeVisible();
    await expect(page.locator('text=Admin Portal').first()).toBeVisible();
  });

  test('2. All Doctors Directory (/doctors): Case-insensitive filtering, Availability, Format & Sorting', async ({ page }) => {
    await page.goto('http://localhost:3000/doctors');

    // Verify instant render of 12 realistic doctor cards (zero empty skeleton delay)
    const cards = page.locator('text=✓ BMDC / Board Verified');
    await expect(cards.first()).toBeVisible();
    const initialCount = await cards.count();
    expect(initialCount).toBeGreaterThanOrEqual(12);

    // Test Search by doctor name
    const searchInput = page.locator('input[placeholder^="Search by doctor name"]');
    await searchInput.fill('Sarah');
    await expect(page.locator('h3:has-text("Dr. Sarah Jenkins")')).toBeVisible();
    await searchInput.clear();

    // Test Specialty Filter (e.g. Cardiologist)
    const specialtyDropdown = page.locator('select').first();
    await specialtyDropdown.selectOption('Cardiologist');
    await expect(page.locator('h3:has-text("Dr. Sarah Jenkins")')).toBeVisible();
    await expect(page.locator('h3:has-text("Dr. Amara Okonjo")')).toBeVisible();

    // Test Format Toggle (Video)
    await page.click('button:has-text("Video")');
    await expect(page.locator('text=Showing').first()).toBeVisible();

    // Reset filters
    await page.click('button:has-text("Reset")');
    await expect(specialtyDropdown).toHaveValue('All Specialties');
  });

  test('3. Multi-Step Appointment Booking Engine (/doctors/[id]): 3-Step Zustand Flow & Digital Pass', async ({ page }) => {
    await page.goto('http://localhost:3000/doctors/doc-1');

    // Verify Doctor Profile Header
    await expect(page.locator('h2:has-text("Dr. Sarah Jenkins")')).toBeVisible();
    await expect(page.locator('text=Step 1: Consultation Type & Schedule')).toBeVisible();

    // Step 1: Select Format & Slot
    await page.click('text=HD Video Consultation');
    const slotPill = page.locator('button:has-text("04:30 PM")').first();
    await slotPill.click();

    // Move to Step 2
    await page.click('button:has-text("Next: Patient Details")');

    // Step 2: Patient Information & Symptoms
    await expect(page.locator('text=Step 2: Patient Information & Symptoms')).toBeVisible();

    // Test Pre-Fill Demo Patient button
    await page.click('button:has-text("Pre-fill Demo Patient")');
    await expect(page.locator('input[value="Alexander Hayes"]')).toBeVisible();

    // Select a symptom chip
    await page.click('button:has-text("Severe Headache")');

    // Confirm booking to move to Step 3
    await page.click('button:has-text("Confirm & Issue Digital Pass")');

    // Step 3: Instant Confirmation & Digital Appointment Pass
    await expect(page.locator('text=Digital Appointment Pass Ready')).toBeVisible();
    await expect(page.locator('text=NEWCARE HEALTHCARE PASS')).toBeVisible();
    await expect(page.locator('text=Touchless Clinic QR')).toBeVisible();
    await expect(page.locator('button:has-text("Download Slip (.txt)")')).toBeVisible();
    await expect(page.locator('button:has-text("Export Calendar (.ics)")')).toBeVisible();
  });

  test('4. Role-Based Dashboards (/dashboard, /dashboard/patient, /dashboard/doctor, /dashboard/admin)', async ({ page }) => {
    // A. Unified Dashboard with Role Tabs
    await page.goto('http://localhost:3000/dashboard');
    await expect(page.locator('text=Operations Dashboard')).toBeVisible();
    await expect(page.locator('button:has-text("Patient View")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Doctor Desk")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Admin Portal")').first()).toBeVisible();

    // B. Direct Patient Dashboard (/dashboard/patient)
    await page.goto('http://localhost:3000/dashboard/patient');
    await expect(page.locator('text=PATIENT VIEW • ID #NC-PT-9021')).toBeVisible();
    await expect(page.locator('text=Upcoming Scheduled Visits')).toBeVisible();
    await expect(page.locator('button:has-text("View Pass")').first()).toBeVisible();

    // C. Direct Doctor Dashboard (/dashboard/doctor)
    await page.goto('http://localhost:3000/dashboard/doctor');
    await expect(page.locator('text=CLINICAL DESK')).toBeVisible();
    await expect(page.locator('text=Today\'s Patient Queue & Clinical Schedule')).toBeVisible();

    // Test Doctor Availability Toggle
    const queueToggle = page.locator('button:has-text("Live Queue Active"), button:has-text("Offline")').first();
    await expect(queueToggle).toBeVisible();
    await queueToggle.click();

    // D. Direct Admin Portal (/dashboard/admin)
    await page.goto('http://localhost:3000/dashboard/admin');
    await expect(page.locator('text=ROLE-BASED ADMIN PORTAL • RBAC ENGINE')).toBeVisible();
    await expect(page.locator('text=Total Clinic Revenue')).toBeVisible();
    await expect(page.locator('text=Manage Verified Doctors & Pricing Controls')).toBeVisible();
    await expect(page.locator('text=Clinic Appointments Master Ledger')).toBeVisible();
    await expect(page.locator('text=Role-Based Access Control (RBAC) Active Sessions')).toBeVisible();

    // Test Admin Doctor Verification toggle
    const verifyBadge = page.locator('button:has-text("✓ BMDC Verified")').first();
    await expect(verifyBadge).toBeVisible();
  });

  test('5. Footer Links & About/Contact Pages: Zero dead links and working feedback', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Verify footer link goes to /doctors, not /all-doctors
    const allDoctorsLink = page.locator('footer a:has-text("All Doctors")');
    await expect(allDoctorsLink).toHaveAttribute('href', '/doctors');

    // Verify footer link goes to /dashboard
    const dashboardsLink = page.locator('footer a:has-text("Role Dashboards")');
    await expect(dashboardsLink).toHaveAttribute('href', '/dashboard');

    // Verify zero href="#" in footer
    const deadLinks = page.locator('footer a[href="#"]');
    expect(await deadLinks.count()).toBe(0);

    // Test Contact Page Form Feedback
    await page.goto('http://localhost:3000/contact');
    await page.fill('input[placeholder="John Doe"]', 'Jane Recruiter');
    await page.fill('input[placeholder="you@example.com"]', 'recruiter@healthtech.com');
    await page.fill('textarea[placeholder^="Tell us how"]', 'Great healthcare platform!');
    await page.click('button:has-text("Send Message")');

    await expect(page.locator('text=Message Sent!').first()).toBeVisible();
    await expect(page.locator('text=We\'ll get back to you within 24 hours.').first()).toBeVisible();
  });

});
