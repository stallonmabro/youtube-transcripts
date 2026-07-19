import { test, expect } from "@playwright/test";

test.describe("Smoke tests", () => {
  test("homepage loads", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("YouTube Transcript");
    await expect(page.locator('input[placeholder*="Paste YouTube"]')).toBeVisible();
  });

  test("usage check endpoint returns anonymous limits", async ({ request }) => {
    const res = await request.get("/api/usage/check");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body).toMatchObject({
      allowed: true,
      count: expect.any(Number),
      limit: 3,
    });
  });

  test("dashboard redirects when not signed in", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("/?signin=true");
    expect(page.url()).toContain("signin=true");
  });
});
