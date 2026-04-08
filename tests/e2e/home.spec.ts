import { expect, test } from "@playwright/test";

test("homepage exposes the main sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Travel" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects" }).first()).toBeVisible();
});
