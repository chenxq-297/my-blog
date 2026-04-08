# Personal Blog Admin Phase 2 Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a database-backed blog authoring flow so the owner can create and publish blog posts from `/admin`, with public blog pages reading the unified source.

**Architecture:** Extend the current Next.js + Prisma app with one managed blog-post model and one feature layer that merges database posts with the existing file-based blog entries. Keep the admin editing flow server-rendered, and route homepage/feed/sitemap blog reads through the same unified query layer.

**Tech Stack:** Next.js 16, React 19, TypeScript, PostgreSQL, Prisma, Better Auth, Zod, Tailwind CSS v4, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-04-08-personal-blog-admin-phase-2-blog-design.md`

---

## Preflight

- Keep all work in `E:\krs\other`.
- Preserve the existing `content/blog/` samples; this slice is additive.
- Reuse the current admin auth guard and public article rendering helpers.
- Treat the current uncommitted Phase 1 work as part of the new baseline.

## Planned File Map

### Data Layer

- Modify: `E:\krs\other\prisma\schema.prisma`
- Modify: `E:\krs\other\prisma\seed.ts`
- Create: `E:\krs\other\src\features\blog-posts\schema.ts`
- Create: `E:\krs\other\src\features\blog-posts\queries.ts`
- Create: `E:\krs\other\src\features\blog-posts\actions.ts`

### Admin

- Modify: `E:\krs\other\src\components\admin\admin-nav.tsx`
- Modify: `E:\krs\other\src\app\admin\page.tsx`
- Create: `E:\krs\other\src\components\admin\blog-post-form.tsx`
- Create: `E:\krs\other\src\components\admin\blog-post-list.tsx`
- Create: `E:\krs\other\src\app\admin\blog\page.tsx`
- Create: `E:\krs\other\src\app\admin\blog\new\page.tsx`
- Create: `E:\krs\other\src\app\admin\blog\[id]\page.tsx`

### Public Rendering

- Modify: `E:\krs\other\src\app\blog\page.tsx`
- Modify: `E:\krs\other\src\app\blog\[slug]\page.tsx`
- Modify: `E:\krs\other\src\features\home-sections\queries.ts`
- Modify: `E:\krs\other\src\app\feed.xml\route.ts`
- Modify: `E:\krs\other\src\app\sitemap.ts`

### Tests

- Create: `E:\krs\other\tests\blog-posts.test.ts`
- Create: `E:\krs\other\tests\e2e\admin-blog.spec.ts`

## Task 1: Add The Managed Blog Schema And Validation Layer

**Files:**
- Modify: `E:\krs\other\prisma\schema.prisma`
- Create: `E:\krs\other\src\features\blog-posts\schema.ts`
- Test: `E:\krs\other\tests\blog-posts.test.ts`

- [x] Define the managed blog Prisma model and supporting enum choices.
- [x] Write a failing schema test for valid blog-post input and draft filtering.
- [x] Implement the Zod schema and shared TypeScript types.
- [x] Run the focused test and make it pass.

## Task 2: Build The Unified Public Blog Query Layer

**Files:**
- Create: `E:\krs\other\src\features\blog-posts\queries.ts`
- Modify: `E:\krs\other\prisma\seed.ts`
- Modify: `E:\krs\other\tests\blog-posts.test.ts`

- [x] Add helpers that map database rows into the existing public blog view model.
- [x] Merge database posts with file posts, preferring the database on slug conflicts.
- [x] Expose helpers for public blog lists, blog detail lookup, and all entry lookups used by sitemap/feed.
- [x] Cover merge order, slug precedence, and draft hiding with tests.

## Task 3: Add Admin Blog List, Create, And Edit Flows

**Files:**
- Create: `E:\krs\other\src\features\blog-posts\actions.ts`
- Create: `E:\krs\other\src\components\admin\blog-post-form.tsx`
- Create: `E:\krs\other\src\components\admin\blog-post-list.tsx`
- Create: `E:\krs\other\src\app\admin\blog\page.tsx`
- Create: `E:\krs\other\src\app\admin\blog\new\page.tsx`
- Create: `E:\krs\other\src\app\admin\blog\[id]\page.tsx`
- Modify: `E:\krs\other\src\components\admin\admin-nav.tsx`
- Modify: `E:\krs\other\src\app\admin\page.tsx`

- [x] Add admin actions for create and update with auth checks, slug validation, and cache invalidation.
- [x] Build a reusable server form for blog post fields.
- [x] Build a simple list page showing managed posts and edit links.
- [x] Link the new blog admin routes from the admin shell and dashboard.

## Task 4: Switch Public Blog Surfaces To The Unified Source

**Files:**
- Modify: `E:\krs\other\src\app\blog\page.tsx`
- Modify: `E:\krs\other\src\app\blog\[slug]\page.tsx`
- Modify: `E:\krs\other\src\features\home-sections\queries.ts`
- Modify: `E:\krs\other\src\app\feed.xml\route.ts`
- Modify: `E:\krs\other\src\app\sitemap.ts`

- [x] Update the blog index and detail route to use the managed blog query layer.
- [x] Update homepage latest-writing cards to include managed blog posts.
- [x] Update feed and sitemap generation to include managed blog posts.
- [x] Keep file-based fallback behavior working for existing sample posts.

## Task 5: Add End-To-End Coverage And Verify The Slice

**Files:**
- Create: `E:\krs\other\tests\e2e\admin-blog.spec.ts`
- Modify: `E:\krs\other\README.md` if workflow notes change

- [x] Add an E2E test that signs in, creates a managed blog post, and verifies it renders publicly.
- [x] Run `npm run lint`.
- [x] Run `npm run typecheck`.
- [x] Run `npm test`.
- [x] Run `npx playwright test tests/e2e/admin-auth.spec.ts tests/e2e/admin-config.spec.ts tests/e2e/admin-blog.spec.ts tests/e2e/home.spec.ts`.
- [x] Run `npm run build`.

## Self-Review

### Spec Coverage

- managed blog schema: Tasks 1 and 2
- admin list/create/edit flow: Task 3
- public blog rendering from unified source: Task 4
- homepage/feed/sitemap integration: Task 4
- automated verification of the new flow: Task 5

### Placeholder Scan

- no placeholder markers remain
- every task maps to concrete files
- verification commands are explicit

### Type Consistency

- managed blog records should map into the current blog-card and article view model
- slug precedence rules must stay consistent across blog page, detail page, homepage, feed, and sitemap
