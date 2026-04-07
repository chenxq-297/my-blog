# Project Agents

## Product

This repository hosts a personal website for a software engineer. The site
combines a personal blog, travel writing, project portfolio, and a place for
short ideas or notes.

Current phase: foundation layer only. The immediate goal is to define the
product scope, the implementation plan, and the working rules before code
scaffolding begins.

## Operating Mode

- Work specs-first. Before implementing a new feature or major refactor,
  update or create a document in `docs/superpowers/specs/` and a matching plan
  in `docs/superpowers/plans/`.
- Use `docs/superpowers/` for product-level direction and phased roadmapping.
- Use `openspec/changes/` for implementation-ready change slices that derive
  from the broader product documents.
- Follow the Superpowers workflow in this order whenever possible:
  `brainstorming -> writing-plans -> test-driven-development -> code-review ->
  verification-before-completion`.
- When a concrete slice is ready to build, prefer the OpenSpec flow:
  `openspec-propose/explore -> openspec-apply-change -> validate/archive`.
- Prefer small vertical slices that can be tested end-to-end.
- Record assumptions explicitly in specs instead of leaving them implicit.
- If the technical stack changes, update the relevant spec and plan first.

## V1 Scope

- Personal homepage with clear identity, introduction, and featured content.
- About page with developer profile, experience, and current focus.
- Blog section for long-form technical and reflective writing.
- Travel section for trip stories, photo-led entries, and location context.
- Ideas or notes section for shorter posts and experiments.
- Portfolio section for selected projects and case studies.
- Basic SEO, RSS, sitemap, and social metadata.

## Non-Goals For V1

- Multi-author publishing or user accounts.
- A separate admin dashboard or full headless CMS.
- Native mobile applications.
- E-commerce, payments, or gated member content.
- Complex social systems such as public comments, likes, or follower graphs.

## Default Technical Direction

Unless the user overrides it, prefer:

- A single Next.js application with the App Router.
- TypeScript across the stack.
- Local content files for posts, travel entries, notes, and projects.
- MDX-based authoring with typed content collections.
- Tailwind CSS for styling and design tokens.
- Vitest for unit tests.
- Playwright for smoke and end-to-end coverage.

## Quality Bar

- Every new page or content feature needs at least a basic happy-path test or
  verification step.
- Content collections must remain typed and predictable.
- SEO-sensitive pages should define metadata intentionally.
- The site must work well on mobile and desktop.
- OpenSpec changes should validate cleanly before implementation starts.
- Avoid adding generated code that is not explained by the current plan.
