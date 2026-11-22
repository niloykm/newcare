import { test, expect } from "@playwright/test";

const CORE_ROUTES = [
  "/",
  "/doctors",
  "/doctors/doc-1",
  "/dashboard",
  "/about",
  "/contact",
  "/login",
];

test.describe("NewCare Clinical Overhaul — UI, Accessibility & Engineering QA", () => {
  test("1. Clean Header, Zero Floating Widgets & Coherent US Identity across routes", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(err.message));

    for (const route of CORE_ROUTES) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("main")).toHaveCount(1);

      // No floating Role Switcher widget
      await expect(page.locator('aside[aria-label="Role Switcher"]')).toHaveCount(0);

      // Zero broken/placeholder hrefs
      const badLinks = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        return anchors
          .map((a) => a.getAttribute("href") || "")
          .filter(
            (href) =>
              href === "#" ||
              href.includes("about:invalid") ||
              href.includes("18001234567")
          );
      });
      expect(badLinks, `Invalid hrefs found on ${route}`).toEqual([]);

      // Zero contradictory credentials or fake phone numbers in visible text
      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText, `BMDC leak on ${route}`).not.toMatch(/\bBMDC\b/);
      expect(bodyText, `MBBS leak on ${route}`).not.toMatch(/\bMBBS\b/);
      expect(bodyText, `FCPS leak on ${route}`).not.toMatch(/\bFCPS\b/);
      expect(bodyText, `Fake hotline leak on ${route}`).not.toContain("(800) 123-4567");
      expect(bodyText, `John Doe leak on ${route}`).not.toContain("John Doe");
    }

    // Filter out expected network-offline errors from external API backend if unreachable in local test
    const criticalConsoleErrors = consoleErrors.filter(
      (msg) => !msg.includes("newcarebackend.vercel.app") && !msg.includes("ERR_NAME_NOT_RESOLVED")
    );
    expect(criticalConsoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("2. Interactive Care Estimator, Service Card Linking & Radix Assessment Dialog", async ({
    page,
  }) => {
    await page.goto("/");

    // Clicking a service card button selects that service in the estimator
    const servicesSection = page.locator("#services");
    await servicesSection.getByRole("button", { name: "Estimate This Care" }).nth(1).click();
    await expect(page.locator("#care-service-select")).toHaveValue("elderly-dementia");

    // 8-hour shift at $32/hr = $256
    await expect(page.locator("#estimator").getByText("$256")).toBeVisible();

    // Switch to 12-Hour Shift -> $384
    await page.getByRole("button", { name: "12-Hour Shift" }).click();
    await expect(page.locator("#estimator").getByText("$384")).toBeVisible();

    // Open Radix Assessment Dialog
    await page.getByRole("button", { name: "Request RN Assessment" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Submit empty form to test field-level validation
    await dialog.getByRole("button", { name: "Submit Care Request" }).click();
    await expect(dialog.locator("#patient-name-input")).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.locator("#phone-input")).toHaveAttribute("aria-invalid", "true");

    // Fill valid values and submit
    await dialog.locator("#patient-name-input").fill("Eleanor Vance");
    await dialog.locator("#phone-input").fill("(212) 555-0192");
    await dialog.getByRole("button", { name: "Submit Care Request" }).click();

    await expect(dialog.getByText(/NC-CARE-/)).toBeVisible();
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toBeHidden();
  });

  test("3. Interactive Clinical FAQ & Dark Mode Theme Sync", async ({ page }) => {
    await page.goto("/");

    // First FAQ open by default
    await expect(page.getByText(/within 3 to 4 hours/)).toBeVisible();

    // Open second FAQ
    const secondFaq = page.getByRole("button", {
      name: "Can our family meet the assigned caregiver before the first shift?",
    });
    await secondFaq.click();
    await expect(secondFaq).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/brief phone or video introduction/)).toBeVisible();

    // Toggle theme and verify Tailwind v4 dark mode updates surface colors
    const themeToggle = page.getByRole("button", { name: /Switch to dark theme/i });
    await themeToggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await expect
      .poll(() =>
        page.evaluate(() => window.getComputedStyle(document.body).backgroundColor)
      )
      .toBe("rgb(11, 15, 20)");
  });

  test("4. Specialist Directory, 3-Step Booking & Portals Sync", async ({ page }) => {
    await page.goto("/doctors");
    await expect(
      page.getByRole("heading", { name: "Board-Certified Specialist Directory" })
    ).toBeVisible();

    // Filter to Cardiologist
    await page.getByLabel("Filter by specialty").selectOption("Cardiologist");
    await expect(page.getByText("Dr. Sarah Jenkins")).toBeVisible();

    // Navigate to booking
    await page.getByRole("link", { name: "Book Visit" }).first().click();
    await expect(page).toHaveURL(/\/doctors\/doc-1/);

    // Complete 3-step booking
    await page.getByRole("button", { name: "Continue to Patient Info" }).click();
    await page.getByRole("button", { name: "Confirm Appointment" }).click();
    await expect(page.getByRole("heading", { name: "Appointment Confirmed" })).toBeVisible();

    // Check Portals tabs
    await page.goto("/dashboard");
    await page.getByRole("tab", { name: "Physician Desk" }).click();
    await expect(page.getByText("Patient Consultation Queue")).toBeVisible();
    await page.getByRole("tab", { name: "Clinic Admin" }).click();
    await expect(page.getByText("NY License Verified").first()).toBeVisible();
  });

  test("5. Responsive QA: 1440x900 Desktop & 390x844 Mobile — Zero Overflow", async ({
    page,
  }) => {
    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "mobile", width: 390, height: 844 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      for (const route of ["/", "/doctors", "/dashboard", "/about", "/contact"]) {
        await page.goto(route, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(200);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `Horizontal overflow on ${route} at ${vp.name}`).toBeLessThanOrEqual(1);
      }
    }
  });
});
