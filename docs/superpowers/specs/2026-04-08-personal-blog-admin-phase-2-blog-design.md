# Personal Blog Admin Phase 2 Blog Design

## Overview

Phase 1 established the admin foundation and made the site's framing content
configurable. Phase 2 should start with the highest-value content type:
database-backed blog posts.

The goal is to let the owner write, edit, and publish blog posts from `/admin`
without forcing an immediate migration of travel entries, notes, or projects.
This slice should be a true vertical feature: content is created in the admin,
appears on the public blog, and flows through homepage discovery plus feed and
sitemap generation.

## Product Goals

1. Let the site owner publish blog posts from the admin backend.
2. Keep the current public blog experience intact while introducing a managed
   database source.
3. Preserve compatibility with the existing file-based blog samples during the
   transition period.
4. Reuse the current editorial presentation instead of rebuilding the public
   UI from scratch.

## Scope

### In Scope

- A database model for admin-managed blog posts.
- Admin routes for listing, creating, and editing blog posts.
- Structured validation for blog post forms.
- Public blog routes that read managed posts.
- A hybrid read model where database posts and file posts can coexist.
- Homepage latest-writing cards using the unified blog source.
- Feed and sitemap updates so managed blog posts are discoverable.
- Basic automated tests for the schema, merge logic, and admin-to-public happy
  path.

### Out Of Scope

- Travel, notes, and project management.
- Rich text or block-based editors.
- Image uploads and media library support.
- Multi-user editorial workflows.
- Post deletion, restore flows, or version history.

## Recommended Approach

### Option A: Database-first blog with file fallback

- Add a managed blog table.
- Keep `content/blog/*.mdx` as fallback content.
- Prefer database records when a slug exists in both sources.

This is the recommended option. It creates the least migration risk while
unlocking the first real publishing workflow in the admin.

### Option B: Full blog migration to database

- Import all existing file posts into the database.
- Remove file-based blog reads from the public site.

This would simplify the final runtime model, but it makes this slice larger and
raises migration risk before the admin writing flow is proven.

### Option C: Admin edits files directly

- Keep blog posts file-based.
- Build an admin editor that writes `.mdx` files on disk.

This keeps one content source, but it is fragile for deployment environments
and does not fit the backend-managed direction already established in Phase 1.

## Data Ownership

### Database-managed for this slice

- blog title
- slug
- summary
- body
- category
- reading time
- date
- accent
- tags
- featured flag
- published flag

### File-managed for now

- existing sample blog files
- travel entries
- notes
- projects

### Source precedence

- Public blog pages must prefer the database entry when a database post and a
  file post share the same slug.
- Unpublished database posts must never appear on public routes, the homepage,
  sitemap, or feed output.

## Admin Experience

### Admin routes

- `/admin/blog`: list managed blog posts and link to editing routes.
- `/admin/blog/new`: create a new blog post.
- `/admin/blog/[id]`: edit an existing managed blog post.

### Editing model

Use a structured form with:

- title
- slug
- summary
- category
- reading time
- publish date
- accent
- tags
- featured
- published
- body

The body editor should be a plain textarea that accepts Markdown/MDX-style
content. This keeps the implementation small and aligns with the existing
rendering model.

## Public Rendering Model

- Introduce a blog-post feature layer that maps managed database posts into the
  same view model used by the public blog.
- Public blog list and detail pages should use the unified source instead of
  reading files directly.
- Homepage latest-writing cards should use the unified blog list so newly
  published admin posts appear without additional migration work.
- Feed and sitemap should include managed blog posts alongside the existing
  file-based content model.

## Database Model

Add a `ManagedBlogPost` table with:

- primary key id
- unique slug
- title
- summary
- body
- category
- reading time
- publishedAt
- accent
- tags as `Json`
- featured boolean
- published boolean
- timestamps

This model is intentionally limited to the fields already used by the public
blog card and article templates.

## Testing Strategy

### Unit / integration

- schema validation for managed blog input
- merge behavior between database posts and file posts
- public filtering so drafts stay private

### End-to-end

- admin owner creates a blog post
- the new post appears on `/blog`
- the post detail route renders the saved content

## Risks And Trade-offs

- Hybrid data sources add temporary complexity.
  Mitigation: centralize blog source merging in one feature layer and keep
  precedence rules explicit.
- A textarea editor is less polished than a rich editor.
  Mitigation: accept the trade-off in exchange for shipping a reliable first
  publishing workflow quickly.
- Feed, homepage, and blog pages can drift if they each read different blog
  queries.
  Mitigation: route them all through the same unified public blog query layer.

## Acceptance Criteria

- The owner can create and edit a managed blog post from `/admin`.
- Published managed posts appear on `/blog` and `/blog/[slug]`.
- Draft managed posts remain private.
- Homepage latest-writing cards can include managed blog posts.
- Feed and sitemap include published managed blog posts.
- Existing file-based blog content continues to work during the transition.
