import { test, expect } from '@playwright/test';

test.describe('NewCare Healthcare & Caregiver Overhaul - Clinical Standards', () => {

  test('1. Value Proposition & Hero Section Verification', async ({ page }) => {
    await page.goto('/');

    // Clinical Trust Indicators (Above the fold)
    await expect(page.getByText('100% Background-Checked Caregivers • Licensed Clinical RNs')).toBeVisible();

    // Utility-driven Headline & Subheadline
    await expect(page.locator('h1')).toContainText('Verified In-Home Care & Professional Nursing Support');
    await expect(page.getByText('dispatched directly to your residence')).toBeVisible();

    // Dual action buttons
    await expect(page.getByRole('link', { name: 'Book Care Today' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'How We Vet Caregivers' }).first()).toBeVisible();

    // Clinical microcopy guarantees
    await expect(page.getByText('On-demand dispatch available in under 4 hours')).toBeVisible();
    await expect(page.getByText('Zero multi-month lock-in contracts')).toBeVisible();
  });

  test('2. Interactive Care Estimation & Booking Preview Widget', async ({ page }) => {
    await page.goto('/');

    // Check Estimator is present in Hero
    await expect(page.getByRole('heading', { name: 'Interactive Care Estimation & Booking' })).toBeVisible();

    // Test Service Selector change
    const careSelect = page.locator('#care-service-select');
    await expect(careSelect).toBeVisible();
    await careSelect.selectOption('elderly-dementia');

    // Verify rate updates ($32/hr * 8h = $256)
    await expect(page.getByText('$256')).toBeVisible();

    // Open Assessment Modal
    await page.getByRole('button', { name: 'Schedule Free Assessment' }).click();
    await expect(page.locator('#modal-title')).toBeVisible();

    // Fill intake form
    await page.fill('#patient-name-input', 'Martha Washington');
    await page.fill('#phone-input', '(555) 234-5678');
    await page.getByRole('button', { name: 'Submit Care Request' }).click();

    // Confirm reference code is generated
    await expect(page.getByText('Care Inquiry Dispatched')).toBeVisible();
    await expect(page.getByText(/NC-CARE-/).first()).toBeVisible();
  });

  test('3. Trust Bar & Clinical Compliance Verification', async ({ page }) => {
    await page.goto('/');

    // Check Trust Metrics
    await expect(page.getByText('FBI Background Cleared')).toBeVisible();
    await expect(page.getByText('Urgent Dispatch Window')).toBeVisible();
    await expect(page.getByText('Supervisory RN Coverage')).toBeVisible();
    await expect(page.getByText('Liability & Bond Coverage')).toBeVisible();

    // Compliance strip
    await expect(page.getByText('State Licensed Home Care Services Agency (LHCSA) Compliant')).toBeVisible();
    await expect(page.getByText('HIPAA-Compliant Electronic Charting')).toBeVisible();
  });

  test('4. Core Care Services & Transparent Rates Section', async ({ page }) => {
    await page.goto('/#services');

    await expect(page.getByRole('heading', { name: 'Core In-Home Care Services & Transparent Rates' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Skilled Nursing (RN / LPN)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Elderly & Dementia Companion Care' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Post-Surgical & Orthopedic Recovery' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pediatric Specialized Care' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '24/7 Dedicated Live-In Care' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Physician Consults & Telehealth' })).toBeVisible();

    // Check pricing labels
    await expect(page.locator('#services').getByText('$48').first()).toBeVisible();
    await expect(page.locator('#services').getByText('$32').first()).toBeVisible();
  });

  test('5. 3-Step Coordination Process & Safety Protocols', async ({ page }) => {
    await page.goto('/#process');

    await expect(page.getByRole('heading', { name: '3-Step Care Coordination Process' })).toBeVisible();
    await expect(page.getByText('STEP 01')).toBeVisible();
    await expect(page.getByText('STEP 02')).toBeVisible();
    await expect(page.getByText('STEP 03')).toBeVisible();

    // Safety section
    await expect(page.getByRole('heading', { name: 'Caregiver Qualifications & Safety Standards' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Primary-Source License Validation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Level-2 Criminal & FBI Fingerprinting' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'In-Person Clinical Competency Testing' })).toBeVisible();
  });

  test('6. Family Reviews & Interactive FAQ', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Verified Patient & Family Experiences' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Frequently Asked Clinical Questions' })).toBeVisible();

    // First FAQ is open by default
    await expect(page.getByText('3 to 4 hours across Greater New York')).toBeVisible();

    // Test clicking second FAQ to expand it
    const secondFaq = page.getByRole('button', { name: 'Can our family meet or interview the caregiver before care begins?' });
    await expect(secondFaq).toBeVisible();
    await secondFaq.click();
    await expect(page.getByText('prior to shift commencement')).toBeVisible();
  });

  test('7. High-Contrast Booking CTA Banner & Navigation', async ({ page }) => {
    await page.goto('/');

    // Banner verification
    await expect(page.getByRole('heading', { name: 'Need Verified In-Home Care for a Loved One Today?' })).toBeVisible();
    await expect(page.getByText('(800) 123-4567').first()).toBeVisible();

    // Navbar Triage strip
    await expect(page.getByText('24/7 Nurse Triage & Dispatch:').first()).toBeVisible();
  });

  test('8. Responsive Breakpoint: 390px Mobile Inspection', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check headline wraps cleanly
    await expect(page.locator('h1')).toBeVisible();

    // Check estimator inputs work on mobile
    const careSelect = page.locator('#care-service-select');
    await expect(careSelect).toBeVisible();

    // Check emergency phone link is visible and clickable
    const phoneLink = page.locator('a[href="tel:18001234567"]').first();
    await expect(phoneLink).toBeVisible();

    // Ensure zero horizontal overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('9. Responsive Breakpoint: 768px Tablet Inspection', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

  test('10. Responsive Breakpoint: 1440px Desktop Inspection', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 2);
  });

});
