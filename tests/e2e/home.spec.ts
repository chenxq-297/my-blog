import { expect, test } from "@playwright/test";

test("homepage exposes the main sections", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "简约地记录，认真地发布，留下一个真正属于自己的站点。",
    }),
  ).toBeVisible();

  await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Travel" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects" }).first()).toBeVisible();
});
