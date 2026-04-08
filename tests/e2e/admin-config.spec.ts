import { expect, test } from "@playwright/test";

test("saving site settings updates the public homepage", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/site");

  const siteNameField = page.getByLabel("Site name");
  const originalName = await siteNameField.inputValue();
  const updatedName = `Codex Site ${Date.now()}`;

  await siteNameField.fill(updatedName);
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("button", { name: "Save site settings" }).click(),
  ]);

  await page.goto("/");
  await expect(page.getByRole("link", { name: updatedName }).first()).toBeVisible();

  await page.goto("/admin/site");
  await siteNameField.fill(originalName);
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page.getByRole("button", { name: "Save site settings" }).click(),
  ]);
});
