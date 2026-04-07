import { expect, test } from "@playwright/test";

test("unauthenticated visitors are redirected to the admin login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("the seeded admin can sign in and reach the dashboard", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Admin dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Dashboard" })).toHaveAttribute("href", "/admin");
  await expect(page.getByRole("link", { name: "Site settings" })).toHaveAttribute(
    "href",
    "/admin/site",
  );
  await expect(page.getByRole("link", { name: "Home sections" })).toHaveAttribute(
    "href",
    "/admin/home",
  );
  await expect(page.getByRole("link", { name: "About page" })).toHaveAttribute(
    "href",
    "/admin/about",
  );
});

test("the admin navigation routes resolve after sign-in", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.getByRole("link", { name: "Site settings" }).click();
  await expect(page.getByRole("heading", { name: "Site settings" })).toBeVisible();

  await page.getByRole("link", { name: "Home sections" }).click();
  await expect(page.getByRole("heading", { name: "Home sections" })).toBeVisible();

  await page.getByRole("link", { name: "About page" }).click();
  await expect(page.getByRole("heading", { name: "About page" })).toBeVisible();
});

test("invalid credentials keep the user on login and show an inline error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("alert")).toBeVisible();
});
