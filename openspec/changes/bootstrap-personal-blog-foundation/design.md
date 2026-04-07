## Context

The broader product direction now centers on a personal website rather than an
application with user management. The workspace already has product-level notes
in `docs/superpowers/`, but the first buildable slice needs to focus on the
site foundation, the content model, and the main public routes.

## Goals / Non-Goals

**Goals:**

- Create a strong baseline for a personal site with a clear editorial identity.
- Use a file-based publishing model that keeps content easy to write and review.
- Define reusable collections for blog posts, travel entries, ideas, and
  project case studies.
- Build the first navigation structure and core page types.
- Add enough SEO support that content is publishable from the start.

**Non-Goals:**

- A separate admin panel or full CMS.
- Public comments, follower systems, or advanced community features.
- Complex backend services or a dedicated API layer.
- Search, newsletter automation, or analytics dashboards in the first slice.

## Decisions

### 1. Use a single content-first Next.js application

This keeps the architecture simple and fits a personal site better than a
frontend-plus-API split. It also makes routing, metadata, and static content
delivery easier to manage in one place.

Alternatives considered:
- Monorepo with separate API: rejected because V1 does not need that
  complexity.
- Static site generator only: rejected because the chosen app framework gives
  more room for future expansion without changing the mental model.

### 2. Use local MDX-style content collections

The site owner is also the publisher, so local content files are the lowest
friction authoring model. Typed frontmatter or schema validation reduces the
risk of content drift as the site grows.

Alternatives considered:
- Headless CMS: rejected because it increases setup cost too early.
- Raw markdown with no schema: rejected because portfolio and travel entries
  need more reliable metadata.

### 3. Treat blog, travel, ideas, and projects as distinct but related content

These content types have different rhythms and presentation needs. Keeping them
separate improves navigation clarity while preserving a shared site identity.

Alternatives considered:
- One flat "posts" model for everything: rejected because travel writing and
  project case studies need different metadata and layout cues.

### 4. Prioritize site shell and content routes before visual flourishes

A coherent structure and publishing workflow matter more than advanced polish in
the first slice. Visual depth can evolve after the content model is stable.

Alternatives considered:
- Start with a full visual system first: rejected because it risks style work
  without a working content flow.

## Risks / Trade-offs

- Local content is simple but may need migration later -> mitigate by keeping
  collection schemas explicit and well-organized.
- A personal site can become visually generic if structure leads design ->
  mitigate by deliberately shaping tone, typography, and section identity.
- Distinct content types add routing overhead -> mitigate by sharing rendering
  primitives where practical.
- SEO work can sprawl -> mitigate by focusing on core metadata, sitemap, and
  feed generation in the first slice.

## Migration Plan

- This is a greenfield workspace, so no live migration is needed.
- Create the application structure and toolchain first.
- Define content schemas and add sample entries.
- Build the shared shell and core page routes.
- Add metadata and verification once the main pages are functional.

## Open Questions

- Final visual direction: restrained editorial, more atmospheric travel-heavy,
  or something in between.
- Whether the first version should include a dedicated contact page.
- Whether project pages should use MDX content or a typed data file plus rich
  sections.
