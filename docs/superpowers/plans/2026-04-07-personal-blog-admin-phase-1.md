# Personal Blog Admin Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a database-backed admin foundation to the existing personal blog so the site owner can manage site settings, homepage modules, and About content from `/admin`.

**Architecture:** Keep the current Next.js application as the only runtime boundary. Add PostgreSQL, Prisma, and Better Auth inside the same app, seed one admin account plus one row of public-facing configuration, and progressively switch the public shell, homepage, and About page from hardcoded objects to cached database reads.

**Tech Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Better Auth, Zod, Tailwind CSS v4, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-04-07-personal-blog-admin-phase-1-design.md`

---

## Preflight

- Make sure all work happens in `E:\krs\other`.
- Keep the existing `content/` collections in place. Phase 1 does not migrate
  long-form content into the database.
- Prepare a local PostgreSQL database before implementation, for example
  `personal_blog_dev`.
- Copy `.env.example` to `.env.local` before running the app locally.

## Planned File Map

### Infrastructure

- Modify: `E:\krs\other\package.json`
- Modify: `E:\krs\other\README.md`
- Create: `E:\krs\other\.env.example`
- Create: `E:\krs\other\prisma.config.ts`
- Create: `E:\krs\other\prisma\schema.prisma`
- Create: `E:\krs\other\prisma\seed.ts`
- Create: `E:\krs\other\src\lib\env.ts`
- Create: `E:\krs\other\src\lib\db.ts`
- Create: `E:\krs\other\src\lib\cache.ts`

### Authentication

- Create: `E:\krs\other\src\lib\auth.ts`
- Create: `E:\krs\other\src\lib\auth-client.ts`
- Create: `E:\krs\other\src\features\auth\creation-guard.ts`
- Create: `E:\krs\other\src\features\auth\server.ts`
- Create: `E:\krs\other\src\features\auth\owner-bootstrap.ts`
- Create: `E:\krs\other\src\features\auth\login-form.tsx`
- Create: `E:\krs\other\src\components\admin\admin-nav.tsx`
- Create: `E:\krs\other\src\app\api\auth\[...all]\route.ts`
- Create: `E:\krs\other\src\app\admin\layout.tsx`
- Create: `E:\krs\other\src\app\(admin-public)\admin\login\page.tsx`
- Create: `E:\krs\other\src\app\admin\page.tsx`

### Site Settings

- Create: `E:\krs\other\src\features\site-config\defaults.ts`
- Create: `E:\krs\other\src\features\site-config\schema.ts`
- Create: `E:\krs\other\src\features\site-config\queries.ts`
- Create: `E:\krs\other\src\features\site-config\actions.ts`
- Create: `E:\krs\other\src\components\admin\site-settings-form.tsx`
- Create: `E:\krs\other\src\app\admin\site\page.tsx`
- Modify: `E:\krs\other\src\lib\site.ts`
- Modify: `E:\krs\other\src\app\layout.tsx`
- Modify: `E:\krs\other\src\components\site-header.tsx`
- Modify: `E:\krs\other\src\components\site-footer.tsx`

### Homepage

- Create: `E:\krs\other\src\features\home-sections\defaults.ts`
- Create: `E:\krs\other\src\features\home-sections\schema.ts`
- Create: `E:\krs\other\src\features\home-sections\queries.ts`
- Create: `E:\krs\other\src\features\home-sections\actions.ts`
- Create: `E:\krs\other\src\components\admin\home-sections-form.tsx`
- Create: `E:\krs\other\src\app\admin\home\page.tsx`
- Modify: `E:\krs\other\src\app\page.tsx`

### About

- Create: `E:\krs\other\src\features\about\defaults.ts`
- Create: `E:\krs\other\src\features\about\schema.ts`
- Create: `E:\krs\other\src\features\about\queries.ts`
- Create: `E:\krs\other\src\features\about\actions.ts`
- Create: `E:\krs\other\src\components\admin\about-form.tsx`
- Create: `E:\krs\other\src\app\admin\about\page.tsx`
- Modify: `E:\krs\other\src\app\about\page.tsx`

### Tests

- Create: `E:\krs\other\tests\env.test.ts`
- Create: `E:\krs\other\tests\auth-creation-guard.test.ts`
- Create: `E:\krs\other\tests\auth-session.test.ts`
- Create: `E:\krs\other\tests\owner-bootstrap.test.ts`
- Create: `E:\krs\other\tests\site-config.test.ts`
- Create: `E:\krs\other\tests\home-sections.test.ts`
- Create: `E:\krs\other\tests\about.test.ts`
- Create: `E:\krs\other\tests\e2e\admin-auth.spec.ts`
- Create: `E:\krs\other\tests\e2e\admin-config.spec.ts`
- Modify: `E:\krs\other\tests\e2e\home.spec.ts`

## Task 1: Add Runtime, Environment, And Database Foundations

**Files:**
- Modify: `E:\krs\other\package.json`
- Create: `E:\krs\other\.env.example`
- Create: `E:\krs\other\prisma.config.ts`
- Create: `E:\krs\other\src\lib\env.ts`
- Create: `E:\krs\other\src\lib\db.ts`
- Test: `E:\krs\other\tests\env.test.ts`

- [ ] **Step 1: Install the backend dependencies**

Run:

```bash
npm install @prisma/client better-auth @better-auth/prisma-adapter
npm install -D prisma tsx
```

Expected: install completes without dependency resolution errors.

- [ ] **Step 2: Write the failing environment test**

Create `E:\krs\other\tests\env.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { envSchema } from "../src/lib/env";

describe("env schema", () => {
  it("accepts the required backend variables", () => {
    const parsed = envSchema.parse({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/personal_blog_dev",
      BETTER_AUTH_SECRET: "a-secret-at-least-32-characters-long",
      BETTER_AUTH_URL: "http://localhost:3000",
      ADMIN_EMAIL: "owner@example.com",
      ADMIN_PASSWORD: "password1234",
      ADMIN_NAME: "Site Owner",
    });

    expect(parsed.ADMIN_EMAIL).toBe("owner@example.com");
  });
});
```

- [ ] **Step 3: Run the test to confirm the env module does not exist yet**

Run:

```bash
npx vitest run tests/env.test.ts
```

Expected: the suite fails with `Cannot find module '../src/lib/env'`.

- [ ] **Step 4: Add env parsing, Prisma config, and the shared database client**

Update `E:\krs\other\package.json` with these scripts:

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

Create `E:\krs\other\prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

Create `E:\krs\other\src\lib\env.ts`:

```ts
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_NAME: z.string().min(1),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_NAME: process.env.ADMIN_NAME,
});
```

Create `E:\krs\other\src\lib\db.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
```

Create `E:\krs\other\.env.example`:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/personal_blog_dev"
BETTER_AUTH_SECRET="replace-with-a-long-random-secret"
BETTER_AUTH_URL="http://localhost:3000"
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="password1234"
ADMIN_NAME="Site Owner"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

- [ ] **Step 5: Re-run the env test**

Run:

```bash
npx vitest run tests/env.test.ts
```

Expected: `PASS tests/env.test.ts`.

- [ ] **Step 6: Commit the infrastructure baseline**

Run:

```bash
git add package.json package-lock.json .env.example prisma.config.ts src/lib/env.ts src/lib/db.ts tests/env.test.ts
git commit -m "chore: add backend runtime foundations"
```

## Task 2: Define Prisma Schema And Seed The Initial Admin Data

**Files:**
- Create: `E:\krs\other\prisma\schema.prisma`
- Create: `E:\krs\other\prisma\seed.ts`
- Create: `E:\krs\other\src\features\site-config\defaults.ts`
- Create: `E:\krs\other\src\features\home-sections\defaults.ts`
- Create: `E:\krs\other\src\features\about\defaults.ts`
- Test: `E:\krs\other\tests\site-config.test.ts`

- [ ] **Step 1: Write the failing defaults test**

Create `E:\krs\other\tests\site-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { defaultSiteSettings } from "../src/features/site-config/defaults";
import { defaultHomeSections } from "../src/features/home-sections/defaults";
import { defaultAboutPage } from "../src/features/about/defaults";

describe("default admin-managed content", () => {
  it("includes a public site name and title", () => {
    expect(defaultSiteSettings.siteName).toBeTruthy();
    expect(defaultSiteSettings.title).toBeTruthy();
  });

  it("defines the four phase-1 homepage modules", () => {
    expect(defaultHomeSections.map((section) => section.key)).toEqual([
      "HERO",
      "LATEST_WRITING",
      "TRAVEL",
      "SELECTED_WORK",
    ]);
  });

  it("includes at least three About principles", () => {
    expect(defaultAboutPage.principles.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run the defaults test**

Run:

```bash
npx vitest run tests/site-config.test.ts
```

Expected: the suite fails because the defaults files do not exist yet.

- [ ] **Step 3: Add the default content constants**

Create `E:\krs\other\src\features\site-config\defaults.ts` with:

```ts
export const defaultSiteSettings = {
  siteName: "Your Name",
  role: "Software Engineer",
  location: "Shanghai / Remote",
  title: "Code, travel, and notes in progress",
  description:
    "A personal website for a software engineer, collecting writing, travel notes, project case studies, and smaller ideas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@example.com",
  intro:
    "This site is a long-term notebook for engineering, travel, and ideas that are still taking shape.",
  status:
    "Currently building calm systems, shipping small things often, and keeping a better travel log.",
  locale: "zh_CN",
};

export const defaultNavItems = [
  { label: "Home", href: "/", sortOrder: 0, isVisible: true },
  { label: "About", href: "/about", sortOrder: 1, isVisible: true },
  { label: "Blog", href: "/blog", sortOrder: 2, isVisible: true },
  { label: "Travel", href: "/travel", sortOrder: 3, isVisible: true },
  { label: "Ideas", href: "/notes", sortOrder: 4, isVisible: true },
  { label: "Projects", href: "/projects", sortOrder: 5, isVisible: true },
];

export const defaultSocialLinks = [
  { label: "GitHub", href: "https://github.com/your-handle", sortOrder: 0, isVisible: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", sortOrder: 1, isVisible: true },
  { label: "Email", href: "mailto:hello@example.com", sortOrder: 2, isVisible: true },
];
```

Create `E:\krs\other\src\features\home-sections\defaults.ts` with the phase-1
module keys `HERO`, `LATEST_WRITING`, `TRAVEL`, and `SELECTED_WORK`, plus hero
stats in `defaultHomeSectionItems`.

Create `E:\krs\other\src\features\about\defaults.ts` with the initial About
eyebrow, title, description, profile copy, focus copy, and `principles` array.

- [ ] **Step 4: Define the Prisma schema**

Create `E:\krs\other\prisma\schema.prisma` with models for:

- auth: `User`, `Session`, `Account`, `Verification`, `AdminUser`
- site config: `SiteSettings`, `NavItem`, `SocialLink`
- homepage: `HomeSection`, `HomeSectionItem`
- about: `AboutPage`

Required enums:

- `HomeSectionKey`
- `HomeSectionSourceCollection`
- `HomeSectionItemKind`
- `ContentCollection`

Implementation constraints:

- `HomeSection.key` must be unique
- `NavItem.sortOrder` and `SocialLink.sortOrder` must be explicit integer fields
- `AboutPage.principles` should use `Json`
- `AdminUser.userId` must be unique

- [ ] **Step 5: Add the seed script**

Create `E:\krs\other\prisma\seed.ts` that:

- upserts one `SiteSettings` record
- recreates `NavItem`, `SocialLink`, `HomeSection`, `HomeSectionItem`, and
  `AboutPage` from the defaults
- does not create the admin login yet, because Better Auth is added in Task 3

- [ ] **Step 6: Generate, migrate, seed, and verify**

Run:

```bash
npx prisma generate
npx prisma migrate dev --name init_admin_phase_1
npx prisma db seed
npx vitest run tests/site-config.test.ts
```

Expected: Prisma client generation and migration succeed, seed completes, and
the test passes.

- [ ] **Step 7: Commit the schema and seed layer**

Run:

```bash
git add prisma src/features/site-config/defaults.ts src/features/home-sections/defaults.ts src/features/about/defaults.ts tests/site-config.test.ts
git commit -m "feat: add admin phase one schema and seed data"
```

## Task 3: Add Better Auth And The Admin Route Protection Layer

**Files:**
- Modify: `E:\krs\other\prisma\seed.ts`
- Create: `E:\krs\other\src\lib\auth.ts`
- Create: `E:\krs\other\src\lib\auth-client.ts`
- Create: `E:\krs\other\src\features\auth\creation-guard.ts`
- Create: `E:\krs\other\src\features\auth\server.ts`
- Create: `E:\krs\other\src\features\auth\owner-bootstrap.ts`
- Create: `E:\krs\other\src\features\auth\login-form.tsx`
- Create: `E:\krs\other\src\components\admin\admin-nav.tsx`
- Create: `E:\krs\other\src\app\api\auth\[...all]\route.ts`
- Create: `E:\krs\other\src\app\admin\layout.tsx`
- Create: `E:\krs\other\src\app\(admin-public)\admin\login\page.tsx`
- Create: `E:\krs\other\src\app\admin\page.tsx`
- Create: `E:\krs\other\src\app\admin\site\page.tsx`
- Create: `E:\krs\other\src\app\admin\home\page.tsx`
- Create: `E:\krs\other\src\app\admin\about\page.tsx`
- Test: `E:\krs\other\tests\auth-creation-guard.test.ts`
- Test: `E:\krs\other\tests\auth-session.test.ts`
- Test: `E:\krs\other\tests\owner-bootstrap.test.ts`
- Test: `E:\krs\other\tests\e2e\admin-auth.spec.ts`

- [ ] **Step 1: Write the failing auth E2E test**

Create `E:\krs\other\tests\e2e\admin-auth.spec.ts`:

```ts
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
});
```

- [ ] **Step 2: Run the auth E2E test**

Run:

```bash
npx playwright test tests/e2e/admin-auth.spec.ts
```

Expected: the suite fails because `/admin` and the auth handler do not exist yet.

- [ ] **Step 3: Implement the Better Auth server and client entry points**

Create `E:\krs\other\src\lib\auth.ts` with:

- `betterAuth(...)`
- Prisma adapter wired to `db`
- `emailAndPassword.enabled = true`
- a `databaseHooks.user.create.before` guard that only allows the trusted
  owner bootstrap request to create the first user and blocks all later sign-up
- `nextCookies()` plugin

Create `E:\krs\other\src\lib\auth-client.ts` with:

```ts
"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

Create `E:\krs\other\src\app\api\auth\[...all]\route.ts` with the Next.js
handler export from Better Auth.

- [ ] **Step 4: Update the seed script so the owner account is created through Better Auth**

Create `E:\krs\other\src\features\auth\owner-bootstrap.ts` and modify
`E:\krs\other\prisma\seed.ts` so the owner bootstrap path:

- imports `auth` from `src/lib/auth`
- checks whether a user already exists for `env.ADMIN_EMAIL`
- fails fast with a clear error when the configured owner drifts from an
  existing seeded owner or when registration is already locked behind another
  account
- calls `auth.api.signUpEmail(...)` only when the owner account is missing
- upserts the matching `AdminUser` row after the user exists

Then run:

```bash
npx auth@latest generate --config src/lib/auth.ts --yes
npx prisma db seed
```

Expected: Better Auth updates the Prisma auth models and the seed creates the
owner account without duplicating it on later runs.

- [ ] **Step 5: Implement the admin session guard and login UI**

Create `E:\krs\other\src\features\auth\server.ts` with:

- `getServerSession()`
- `requireAdminSession()` that checks both session existence and `AdminUser`
  membership, redirecting to `/admin/login` when missing

Create `E:\krs\other\src\features\auth\login-form.tsx` with a client form that:

- collects email and password
- calls `authClient.signIn.email(...)`
- shows an inline error message on failure
- redirects to `/admin` on success

Create `E:\krs\other\src\components\admin\admin-nav.tsx` with links to:

- `/admin`
- `/admin/site`
- `/admin/home`
- `/admin/about`

Create `E:\krs\other\src\app\admin\layout.tsx` to require the admin session and
render the dashboard shell.

Create `E:\krs\other\src\app\(admin-public)\admin\login\page.tsx` for the
public login route and `E:\krs\other\src\app\admin\page.tsx` for the protected
dashboard. Keep the login route outside the protected `src/app/admin/layout.tsx`
tree so `/admin/login` stays reachable without weakening the admin shell guard.

Create `E:\krs\other\src\app\admin\site\page.tsx`,
`E:\krs\other\src\app\admin\home\page.tsx`, and
`E:\krs\other\src\app\admin\about\page.tsx` as protected placeholders so the
required admin navigation links resolve before the form tasks land.

Add focused tests in `E:\krs\other\tests\auth-creation-guard.test.ts`,
`E:\krs\other\tests\auth-session.test.ts`, and
`E:\krs\other\tests\owner-bootstrap.test.ts` to cover the trusted first-user
guard, non-admin rejection, and the owner bootstrap lock behavior.

- [ ] **Step 6: Re-run the auth E2E test**

Run:

```bash
npx vitest run tests/auth-creation-guard.test.ts tests/auth-session.test.ts tests/owner-bootstrap.test.ts
npx playwright test tests/e2e/admin-auth.spec.ts
```

Expected: the focused unit tests pass and the admin auth E2E checks pass.

- [ ] **Step 7: Commit the auth foundation**

Run:

```bash
git add prisma/seed.ts src/lib/auth.ts src/lib/auth-client.ts src/features/auth src/components/admin/admin-nav.tsx src/app/api/auth src/app/admin src/app/\(admin-public\)/admin/login/page.tsx tests/auth-creation-guard.test.ts tests/auth-session.test.ts tests/owner-bootstrap.test.ts tests/e2e/admin-auth.spec.ts
git commit -m "feat: add admin authentication flow"
```

## Task 4: Build Site Settings Management And Replace The Public Shell Data Source

**Files:**
- Create: `E:\krs\other\src\lib\cache.ts`
- Create: `E:\krs\other\src\features\site-config\schema.ts`
- Create: `E:\krs\other\src\features\site-config\queries.ts`
- Create: `E:\krs\other\src\features\site-config\actions.ts`
- Create: `E:\krs\other\src\components\admin\site-settings-form.tsx`
- Create: `E:\krs\other\src\app\admin\site\page.tsx`
- Modify: `E:\krs\other\src\lib\site.ts`
- Modify: `E:\krs\other\src\app\layout.tsx`
- Modify: `E:\krs\other\src\components\site-header.tsx`
- Modify: `E:\krs\other\src\components\site-footer.tsx`
- Test: `E:\krs\other\tests\site-config.test.ts`

- [ ] **Step 1: Replace the defaults test with a validation test for site settings**

Update `E:\krs\other\tests\site-config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { siteSettingsSchema } from "../src/features/site-config/schema";

describe("site settings schema", () => {
  it("accepts valid public site settings", () => {
    const parsed = siteSettingsSchema.parse({
      siteName: "Your Name",
      role: "Software Engineer",
      location: "Shanghai / Remote",
      title: "Code, travel, and notes in progress",
      description: "Long-form writing and project notes.",
      url: "http://localhost:3000",
      email: "owner@example.com",
      intro: "A personal site.",
      status: "Currently shipping.",
      locale: "zh_CN",
      navigation: [{ label: "Home", href: "/", sortOrder: 0, isVisible: true }],
      socialLinks: [{ label: "GitHub", href: "https://github.com/example", sortOrder: 0, isVisible: true }],
    });

    expect(parsed.navigation).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run the site-settings test**

Run:

```bash
npx vitest run tests/site-config.test.ts
```

Expected: the suite fails because `site-config/schema.ts` does not exist yet.

- [ ] **Step 3: Implement cache tags, schema validation, queries, and actions**

Create `E:\krs\other\src\lib\cache.ts`:

```ts
export const cacheTags = {
  site: "site-settings",
  home: "home-sections",
  about: "about-page",
} as const;
```

Create `E:\krs\other\src\features\site-config\schema.ts` with:

- the top-level site fields from the spec
- `navigation` and `socialLinks` arrays
- a uniqueness check for `sortOrder`

Create `E:\krs\other\src\features\site-config\queries.ts` with:

- `getSiteSettings()`
- server-side Prisma reads for `SiteSettings`, `NavItem`, and `SocialLink`
- `unstable_cache(..., { tags: [cacheTags.site] })`

Create `E:\krs\other\src\features\site-config\actions.ts` with:

- `updateSiteSettings(input)`
- `requireAdminSession()`
- Zod validation via `siteSettingsSchema.parse(input)`
- one Prisma transaction that updates the main row and recreates nav/social rows
- `revalidateTag(cacheTags.site)`

- [ ] **Step 4: Add the admin form and switch the public shell to database reads**

Create `E:\krs\other\src\components\admin\site-settings-form.tsx` with:

- server-rendered initial values from `getSiteSettings()`
- labeled fields for at least `siteName`, `role`, `location`, `title`,
  `description`, `url`, `email`, `intro`, `status`, and `locale`
- editable repeated rows for `navigation` and `socialLinks`, including `label`,
  `href`, `sortOrder`, and `isVisible`
- one submit button labeled `Save site settings`

Create `E:\krs\other\src\app\admin\site\page.tsx` to render the form.

Replace `E:\krs\other\src\lib\site.ts` with:

- `accentMap`
- `buildMetadata(site)` helper
- `absoluteUrl(pathname, siteUrl)` helper

Update `E:\krs\other\src\app\layout.tsx` so `generateMetadata()` calls
`getSiteSettings()` and passes the result into `buildMetadata(...)`.

Update `E:\krs\other\src\components\site-header.tsx` and
`E:\krs\other\src\components\site-footer.tsx` to fetch their data from
`getSiteSettings()` instead of importing hardcoded `siteConfig`.

- [ ] **Step 5: Re-run unit checks and verify the public shell still builds**

Run:

```bash
npx vitest run tests/site-config.test.ts
npm run typecheck
npm run build
```

Expected: all three commands pass.

- [ ] **Step 6: Commit the site-settings feature**

Run:

```bash
git add src/lib/cache.ts src/features/site-config src/components/admin/site-settings-form.tsx src/app/admin/site/page.tsx src/lib/site.ts src/app/layout.tsx src/components/site-header.tsx src/components/site-footer.tsx tests/site-config.test.ts
git commit -m "feat: add database backed site settings"
```

## Task 5: Build Homepage Configuration Management And Wire The Public Home Page

**Files:**
- Create: `E:\krs\other\src\features\home-sections\schema.ts`
- Create: `E:\krs\other\src\features\home-sections\queries.ts`
- Create: `E:\krs\other\src\features\home-sections\actions.ts`
- Create: `E:\krs\other\src\components\admin\home-sections-form.tsx`
- Create: `E:\krs\other\src\app\admin\home\page.tsx`
- Modify: `E:\krs\other\src\app\page.tsx`
- Create: `E:\krs\other\tests\home-sections.test.ts`
- Modify: `E:\krs\other\tests\e2e\home.spec.ts`

- [ ] **Step 1: Write the failing home-sections validation test**

Create `E:\krs\other\tests\home-sections.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { homeSectionSchema } from "../src/features/home-sections/schema";

describe("home section schema", () => {
  it("accepts a visible section with a positive item limit", () => {
    const parsed = homeSectionSchema.parse({
      key: "LATEST_WRITING",
      eyebrow: "Latest writing",
      title: "Start with the writing that best represents you.",
      description: "Long-form posts and shorter notes stay easy to revisit.",
      isVisible: true,
      sortOrder: 1,
      sourceCollection: "BLOG_AND_NOTES",
      maxItems: 2,
    });

    expect(parsed.maxItems).toBe(2);
  });
});
```

- [ ] **Step 2: Run the home-sections test**

Run:

```bash
npx vitest run tests/home-sections.test.ts
```

Expected: the suite fails because the feature files do not exist yet.

- [ ] **Step 3: Implement the home-section schema, query, and mutation layers**

Create `E:\krs\other\src\features\home-sections\schema.ts` with:

- `key` enum values `HERO`, `LATEST_WRITING`, `TRAVEL`, `SELECTED_WORK`
- `sourceCollection` enum values `BLOG_AND_NOTES`, `TRAVEL`, `PROJECTS`
- `maxItems` as `z.number().int().positive().nullable()`

Create `E:\krs\other\src\features\home-sections\queries.ts` with:

- `getHomeSections()`
- cached reads of `HomeSection` and `HomeSectionItem`
- joins to file-based content loaders from `src/lib/content.tsx`
- per-section derived card arrays for latest writing, travel, and selected work

Create `E:\krs\other\src\features\home-sections\actions.ts` with:

- `updateHomeSections(input)`
- one parsed array of validated sections
- a Prisma transaction that updates each `HomeSection`
- `revalidateTag(cacheTags.home)` and `revalidatePath("/")`

- [ ] **Step 4: Add the admin page and refactor the public homepage**

Create `E:\krs\other\src\components\admin\home-sections-form.tsx` with:

- one card per section showing `eyebrow`, `title`, `description`, and
  visibility state
- editable fields for `eyebrow`, `title`, `description`, `isVisible`,
  `sortOrder`, and `maxItems`
- stable labels so Playwright can update at least one section in a later test

Create `E:\krs\other\src\app\admin\home\page.tsx` to render that form.

Update `E:\krs\other\src\app\page.tsx` so it:

- fetches `getSiteSettings()` and `getHomeSections()`
- reads hero eyebrow/title from the `HERO` section
- keeps the existing public layout shape
- uses `latestWriting.cards`, `travel.cards`, and `selectedWork.cards`
  instead of hardcoded featured slices

Update `E:\krs\other\tests\e2e\home.spec.ts` to assert only stable outputs:

```ts
import { expect, test } from "@playwright/test";

test("homepage exposes the main sections", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Travel" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Projects" }).first()).toBeVisible();
});
```

- [ ] **Step 5: Re-run the homepage unit test, E2E test, and build**

Run:

```bash
npx vitest run tests/home-sections.test.ts
npx playwright test tests/e2e/home.spec.ts
npm run build
```

Expected: all commands pass.

- [ ] **Step 6: Commit the homepage configuration feature**

Run:

```bash
git add src/features/home-sections src/components/admin/home-sections-form.tsx src/app/admin/home/page.tsx src/app/page.tsx tests/home-sections.test.ts tests/e2e/home.spec.ts
git commit -m "feat: add configurable homepage sections"
```

## Task 6: Build About Management And Switch The Public About Page

**Files:**
- Create: `E:\krs\other\src\features\about\schema.ts`
- Create: `E:\krs\other\src\features\about\queries.ts`
- Create: `E:\krs\other\src\features\about\actions.ts`
- Create: `E:\krs\other\src\components\admin\about-form.tsx`
- Create: `E:\krs\other\src\app\admin\about\page.tsx`
- Modify: `E:\krs\other\src\app\about\page.tsx`
- Create: `E:\krs\other\tests\about.test.ts`

- [ ] **Step 1: Write the failing About validation test**

Create `E:\krs\other\tests\about.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { aboutPageSchema } from "../src/features/about/schema";

describe("about page schema", () => {
  it("accepts multiple principles", () => {
    const parsed = aboutPageSchema.parse({
      eyebrow: "About the operator",
      title: "A programmer who keeps engineering and expression close together.",
      description: "A long-term public notebook.",
      profileHeading: "Profile",
      profileBody: "Profile body",
      profileBodySecondary: "Profile body secondary",
      focusHeading: "Current focus",
      focusBody: "Focus body",
      principlesHeading: "Working principles",
      principles: ["One", "Two", "Three"],
    });

    expect(parsed.principles).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run the About test**

Run:

```bash
npx vitest run tests/about.test.ts
```

Expected: the suite fails because the feature files do not exist yet.

- [ ] **Step 3: Implement About validation, queries, and actions**

Create `E:\krs\other\src\features\about\schema.ts` with all fields from the
spec, including `principles: z.array(z.string().min(1)).min(1)`.

Create `E:\krs\other\src\features\about\queries.ts` with `getAboutPage()` using
`unstable_cache(..., { tags: [cacheTags.about] })`.

Create `E:\krs\other\src\features\about\actions.ts` with:

- `updateAboutPage(input)`
- `requireAdminSession()`
- Zod validation
- Prisma update against the first `AboutPage` row
- `revalidateTag(cacheTags.about)` and `revalidatePath("/about")`

- [ ] **Step 4: Add the admin form and refactor the public About page**

Create `E:\krs\other\src\components\admin\about-form.tsx` with labeled fields
for:

- `eyebrow`
- `title`
- `description`
- `profileBody`
- `profileBodySecondary`
- `focusBody`
- `principles`

Represent `principles` as newline-separated textarea content and split it back
into an array before calling `updateAboutPage(...)`.

Create `E:\krs\other\src\app\admin\about\page.tsx` to render the form.

Update `E:\krs\other\src\app\about\page.tsx` so it:

- fetches `getAboutPage()` and `getSiteSettings()`
- renders site identity from the database
- renders the principles list from the stored JSON array
- preserves the current visual layout structure

- [ ] **Step 5: Re-run the About test and full typecheck**

Run:

```bash
npx vitest run tests/about.test.ts
npm run typecheck
npm run build
```

Expected: all commands pass.

- [ ] **Step 6: Commit the About feature**

Run:

```bash
git add src/features/about src/components/admin/about-form.tsx src/app/admin/about/page.tsx src/app/about/page.tsx tests/about.test.ts
git commit -m "feat: add configurable about page"
```

## Task 7: Close The Loop With End-To-End Config Tests And Local Setup Docs

**Files:**
- Create: `E:\krs\other\tests\e2e\admin-config.spec.ts`
- Modify: `E:\krs\other\README.md`

- [ ] **Step 1: Write the failing end-to-end config flow test**

Create `E:\krs\other\tests\e2e\admin-config.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("saving site settings updates the public homepage", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("password1234");
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.goto("/admin/site");
  await page.getByLabel("Site name").fill("New Site Name");
  await page.getByRole("button", { name: "Save site settings" }).click();

  await page.goto("/");
  await expect(page.getByRole("link", { name: "New Site Name" })).toBeVisible();
});
```

- [ ] **Step 2: Run the config E2E test**

Run:

```bash
npx playwright test tests/e2e/admin-config.spec.ts
```

Expected: the test fails until the site-settings form exposes the labeled field
and the save flow is wired end to end.

- [ ] **Step 3: Update the local setup documentation**

Add this section to `E:\krs\other\README.md`:

```md
## Backend Admin Setup

1. Copy `.env.example` to `.env.local`.
2. Start PostgreSQL and create the `personal_blog_dev` database.
3. Run `npm install`.
4. Run `npx auth@latest generate --config src/lib/auth.ts --yes`.
5. Run `npm run db:migrate -- --name init_admin_phase_1`.
6. Run `npm run db:seed`.
7. Run `npm run dev` and visit `/admin/login`.

Default local admin credentials come from `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
```

- [ ] **Step 4: Run the full verification suite**

Run:

```bash
npm run lint
npm run typecheck
npm test
npx playwright test tests/e2e/home.spec.ts tests/e2e/admin-auth.spec.ts tests/e2e/admin-config.spec.ts
npm run build
```

Expected: all commands pass.

- [ ] **Step 5: Commit the test and documentation pass**

Run:

```bash
git add README.md tests/e2e/admin-config.spec.ts
git commit -m "test: verify admin configuration flow"
```

## Self-Review

### Spec Coverage

- admin authentication and `/admin` protection: Task 3
- database-backed site settings, nav, and social links: Task 4
- database-backed homepage modules: Task 5
- database-backed About page: Task 6
- public homepage and About reading database content: Tasks 4, 5, 6
- happy-path and auth-boundary testing: Tasks 3 through 7
- clear migration path without moving long-form content yet: Tasks 2 and 5

### Placeholder Scan

- no placeholder markers remain
- each task names exact files and verification commands

### Type Consistency

- `SiteSettingsInput`, `HomeSectionInput`, and `AboutPageInput` align with the
  corresponding Zod schemas
- `HomeSectionKey`, `HomeSectionSourceCollection`, and `HomeSectionItemKind`
  align between Prisma and TypeScript
