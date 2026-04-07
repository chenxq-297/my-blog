## Context

The workspace already contains project-level design notes in
`docs/superpowers/specs/2026-04-03-student-management-system-design.md` and a
phased plan in `docs/superpowers/plans/2026-04-03-student-management-system.md`.
What is missing is a concrete first implementation slice that a coding agent can
 execute directly through OpenSpec. This change covers the bootstrap layer for a
single-school student management system and intentionally stops before full CRUD
feature completion.

## Goals / Non-Goals

**Goals:**

- Create a monorepo baseline with separate web and API applications.
- Standardize TypeScript tooling, scripts, and test entry points.
- Define the initial user, role, and academic domain models.
- Establish authentication and authorization boundaries early so later modules
  inherit the same rules.
- Keep the first change small enough to implement incrementally.

**Non-Goals:**

- Full student, class, course, grade, or attendance UI workflows.
- Multi-school tenancy or parent-facing features.
- Advanced reporting, import/export, or notification systems.
- Production deployment automation.

## Decisions

### 1. Use a TypeScript monorepo with `apps/web` and `apps/api`

This matches the current project direction in `AGENTS.md` and keeps frontend and
backend concerns separated while preserving a single repository for shared
tooling. A monorepo also makes future shared packages straightforward.

Alternatives considered:
- Separate repositories: rejected because it increases coordination overhead too
  early.
- Single app only: rejected because the system already needs distinct UI and API
  concerns.

### 2. Introduce authentication and RBAC before feature CRUD

Role boundaries are central to this product. Implementing CRUD before auth would
force repeated refactors across handlers, screens, and tests.

Alternatives considered:
- Add auth later: rejected because it would create avoidable rework.
- Hardcode a single admin role: rejected because teachers and students are core
  actors from V1.

### 3. Model the academic entities early, even if not all workflows are built

Students, teachers, classes, courses, enrollments, grades, and attendance are
the stable business nouns of the system. Defining them up front improves schema
consistency and clarifies later APIs.

Alternatives considered:
- Start from only students and add the rest later: rejected because grade and
  attendance logic depend on the relationships between classes, courses, and
  teaching assignments.

### 4. Keep this change focused on foundation and contracts

The goal of this change is not to finish the whole product. It should leave the
repository ready for vertical slices, with a stable technical baseline and a
validated spec trail.

Alternatives considered:
- Include full module CRUD in the first change: rejected because it would make
  the initial change too broad and harder to review.

## Risks / Trade-offs

- Broad initial schema definition may still leave some fields undecided ->
  mitigate by focusing on stable core entities and deferring optional fields.
- Choosing the repository structure now reduces flexibility later -> mitigate by
  keeping package boundaries simple and easy to refactor.
- Auth implemented early can slow initial visible progress -> mitigate by
  limiting scope to one working login path and core guards.
- Two planning systems could drift (`docs/superpowers` and `openspec`) ->
  mitigate by treating OpenSpec changes as implementation slices derived from
  the broader Superpowers documents.

## Migration Plan

- This is a greenfield workspace, so no runtime migration is required.
- Create the repository structure and baseline configs first.
- Add schema definitions and seed-friendly role modeling.
- Implement the first protected application flow.
- Use future OpenSpec changes to extend CRUD and dashboards on top of the new
  foundation.

## Open Questions

- Final API framework choice: NestJS or Fastify.
- Final database adapter and migration tooling details.
- Whether CSV seed/import support should be included in the second or third
  change.
