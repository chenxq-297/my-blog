# Personal Blog Admin Phase 1 Design

## Overview

This phase upgrades the current personal website foundation into a single-app
full-stack product where the public frontend is driven by backend-managed
configuration. The goal is not to build a generic CMS. The goal is to let the
site owner manage key public-facing content without editing source files.

Phase 1 focuses on site settings, homepage modules, and the About page. Full
database-backed management for blog posts, travel entries, notes, and projects
is intentionally deferred to a later phase.

This spec supersedes earlier file-based assumptions for:

- site identity and metadata
- homepage presentation and section configuration
- About page profile content

The existing file-based content collections remain acceptable for article-like
content until Phase 2 begins.

## Product Goals

1. Let the site owner manage core frontend presentation from an authenticated
   admin backend.
2. Keep the architecture simple by using one Next.js application for both the
   public site and the admin experience.
3. Establish a durable data layer that supports future migration of blog,
   travel, notes, and projects into backend-managed content.
4. Preserve the existing visual direction while replacing hardcoded data with
   database-backed configuration.

## Phase 1 Scope

### In Scope

- Single-project full-stack architecture using Next.js.
- Admin authentication for one site owner.
- Database-backed site settings.
- Database-backed navigation items and social links.
- Database-backed homepage module configuration.
- Database-backed About page content.
- Public pages reading their configuration from the database.
- Basic testing for login protection, configuration writes, and public rendering
  of published configuration.

### Out Of Scope

- Multi-user admin roles.
- Public registration or invitation flows.
- Rich text editor or block-based page builder.
- Full content management for blog, travel, notes, and projects.
- Media library, image uploads, comments, analytics dashboards, or newsletter
  tooling.
- Separate API service or independent backend repository.

## Confirmed Technical Direction

### Runtime And Framework

- Node.js runtime.
- Next.js 16 with App Router.
- React 19 and TypeScript.
- Tailwind CSS v4 for styling.

### Data Layer

- PostgreSQL as the primary database.
- Prisma as the ORM, migration tool, and typed database client.

### Authentication

- Better Auth for admin authentication.
- Single administrator model.
- No public signup.
- All `/admin/*` routes require authentication.

### Validation And Testing

- Zod for environment and form validation.
- Vitest for unit and integration tests.
- Playwright for end-to-end coverage of the admin-to-public happy path.

## Recommended Architecture

Use a single Next.js application as the full-stack boundary.

```text
Browser
  -> Next.js app
     -> Public site routes
     -> Admin routes
     -> Server Actions / Route Handlers
     -> Prisma
     -> PostgreSQL
```

This architecture is preferred over a frontend-plus-API split because the
product currently serves one public website and one owner-operated admin area.
Keeping everything in one project reduces deployment complexity, avoids
duplicate types, and keeps future changes easy to coordinate.

## Recommended Project Structure

```text
src/
  app/
    (public)/
      page.tsx
      about/page.tsx
      blog/
      travel/
      notes/
      projects/
    (admin)/
      admin/
        login/page.tsx
        dashboard/page.tsx
        site/page.tsx
        home/page.tsx
        about/page.tsx
    api/
  components/
    public/
    admin/
    ui/
  features/
    auth/
    site-config/
    home-sections/
    about/
  lib/
    auth.ts
    cache.ts
    db.ts
    env.ts
    permissions.ts
prisma/
tests/
scripts/
```

### Structure Rules

- `app/` owns routing and page composition only.
- `features/` owns business logic by domain.
- `components/public` and `components/admin` separate presentation concerns.
- `lib/` contains cross-cutting infrastructure, not feature-specific logic.
- Prisma access should be centralized through feature services rather than
  spread directly through route files.

## Phase 1 Data Ownership

### Database-Managed Data

- site identity and metadata
- homepage hero copy and supporting stats
- homepage section visibility, ordering, titles, descriptions, and item counts
- navigation entries
- social links
- About page profile content and working principles

### File-Managed Data For Now

- blog posts
- travel entries
- notes
- projects

Phase 1 deliberately uses a hybrid model. The site becomes backend-configurable
where it matters most for presentation, while the heavier content migration is
saved for Phase 2.

## Phase 1 Database Tables

The minimum viable schema should include:

- `admin_users`
- `site_settings`
- `nav_items`
- `social_links`
- `home_sections`
- `home_section_items`
- `about_page`

### Table Intent

- `admin_users`: stores the single administrator identity.
- `site_settings`: stores global profile, title, description, contact, and
  metadata defaults.
- `nav_items`: stores ordered public navigation.
- `social_links`: stores ordered external profile and contact links.
- `home_sections`: stores configuration for homepage modules such as hero,
  latest writing, travel, and selected work.
- `home_section_items`: stores manual overrides or pinned entries inside a
  homepage module when needed.
- `about_page`: stores profile copy, focus text, and principle lists.

## Public Rendering Model

- Public pages should query database-backed configuration on the server.
- Admin mutations should revalidate affected public pages after successful
  writes.
- Public rendering should only expose data marked ready for display.
- Homepage modules should use fixed templates with configurable inputs, not a
  freeform drag-and-drop builder.

This keeps the site flexible enough for a personal brand while avoiding the
complexity of a generic page-building system.

## Admin Experience

### Admin Modules In Phase 1

- Dashboard: quick access to editable areas.
- Site Settings: name, role, location, email, title, description, intro,
  status, default metadata values.
- Homepage: hero copy, stats, section toggles, ordering, display counts, and
  optional pinned entries.
- About: profile intro, current focus, and working principles.

### Editing Model

- Use standard forms for structured fields.
- Use textarea or Markdown-friendly long text fields for longer copy.
- Do not introduce a rich text editor in Phase 1.

This keeps implementation smaller and avoids editor-specific complexity before
the data model is proven.

## Caching And Data Freshness

- Public reads should use server-side fetching.
- Mutations should trigger targeted revalidation for affected routes.
- The implementation should prefer route-level or tag-based invalidation rather
  than broad full-site cache clears.

## Security Model

- Only authenticated admin users may access `/admin/*`.
- Public routes must never expose unpublished admin-only fields.
- Server-side authorization must guard all writes, even if the UI already hides
  controls.
- Environment variables and session secrets must be validated at startup.

## Testing Strategy

### Unit / Integration

- form validation for site settings, homepage configuration, and About content
- permission checks for admin-only mutations
- data mapping from Prisma models to public view models

### End-To-End

- admin login succeeds for the configured owner account
- unauthenticated access to `/admin/*` is redirected or denied
- saving site settings changes public output after revalidation
- homepage section changes appear on the public homepage

## Migration Strategy

1. Add database and authentication foundations.
2. Introduce backend-managed site settings, navigation, and social links.
3. Move homepage configuration from hardcoded objects into database tables.
4. Move About page content from hardcoded values into database tables.
5. Keep article-like content file-based until the admin foundation is stable.

This sequence reduces risk by replacing hardcoded presentation data first,
without forcing an immediate content migration.

## Risks And Trade-Offs

- Hybrid content sources increase temporary complexity.
  Mitigation: keep boundaries explicit and document which sections still read
  from files.
- Admin forms may grow quickly if the homepage becomes too flexible.
  Mitigation: keep homepage modules fixed and configurable rather than generic.
- Authentication can become overbuilt for a one-owner product.
  Mitigation: keep to a single-admin model with no public registration.

## Acceptance Criteria

- The site owner can sign into `/admin`.
- The site owner can edit site settings, homepage configuration, and About page
  content from the admin UI.
- The public homepage and About page render database-backed content.
- Navigation and social links are database-driven.
- Tests cover the main configuration happy path and the core auth boundary.
- The architecture leaves a clear path for Phase 2 content migration.
