import { expect, test } from "@playwright/test";

test("owner can create a managed blog post and read it publicly", async ({ page }) => {
  const slug = `managed-post-${Date.now()}`;
  const title = `Managed post ${Date.now()}`;

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto("/admin/blog/new");
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Slug").fill(slug);
  await page.getByLabel("Summary").fill("A managed summary that should appear on the public blog.");
  await page.getByLabel("Category").fill("Engineering");
  await page.getByLabel("Reading time").fill("6 min");
  await page.getByLabel("Publish date").fill("2026-04-08");
  await page.getByLabel("Accent").selectOption("violet");
  await page.getByLabel("Tags").fill("admin, managed");
  await page
    .getByLabel("Body")
    .fill("## Managed body\n\nThis post came from the admin backend.");

  const publishedToggle = page.getByLabel("Published");
  if (!(await publishedToggle.isChecked())) {
    await publishedToggle.check();
  }

  await page.getByRole("button", { name: "Create blog post" }).click();
  await expect(page).toHaveURL(/\/admin\/blog\/.+$/);

  await page.goto("/blog");
  await expect(page.getByRole("link", { name: title }).first()).toBeVisible();

  await page.goto(`/blog/${slug}`);
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("This post came from the admin backend.")).toBeVisible();
});
