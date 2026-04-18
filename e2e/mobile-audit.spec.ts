import { test } from "@playwright/test";

test("mobile layout audit screenshots", async ({ page }) => {
  // Pre-set tutorial as seen to skip it
  await page.addInitScript(() => {
    localStorage.setItem("tutorialSeen", "true");
  });

  await page.goto("/es");
  await page.waitForSelector('[class*="maplibregl-map"]', { timeout: 30000 });
  await page.waitForTimeout(2000);

  // Screenshot 1: Initial state (sidebar should be closed on mobile but isn't)
  await page.screenshot({ path: "audit-01-initial.png", fullPage: false });

  // Screenshot 2: Click sidebar toggle to see state change
  const sidebarToggle = page.locator('button[aria-label*="barra lateral"], button[aria-label*="sidebar"]').first();
  if (await sidebarToggle.isVisible()) {
    await sidebarToggle.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: "audit-02-after-toggle.png", fullPage: false });
  }

  // Screenshot 3: Check legend positioning
  const legend = page.locator('[class*="bottom-4"][class*="left-4"]').first();
  if (await legend.isVisible()) {
    await legend.screenshot({ path: "audit-03-legend.png" });
  }
});
