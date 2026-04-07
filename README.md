# Personal Blog Workspace

This workspace is prepared for a specs-first workflow with Superpowers on
Codex, with OpenSpec connected for implementation-ready change tracking.

## Current Foundation

- Global Superpowers installation is connected through
  `C:\Users\Administrator\.agents\skills\superpowers`.
- Codex multi-agent support is enabled in
  `C:\Users\Administrator\.codex\config.toml`.
- OpenSpec CLI is installed globally and this workspace is initialized with
  project-local OpenSpec skills in `.codex/skills/`.
- Project rules live in `AGENTS.md`.
- Product design lives in `docs/superpowers/specs/`.
- Implementation plans live in `docs/superpowers/plans/`.
- OpenSpec change artifacts live in `openspec/changes/`.

## Local Development

```bash
npm install
npm run dev
```

Useful commands:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## First Personalization Pass

- Update site identity, links, and description in `src/lib/site.ts`
- Replace sample entries under `content/blog/`, `content/travel/`,
  `content/notes/`, and `content/projects/`
- Set `NEXT_PUBLIC_SITE_URL` for correct sitemap, feed, and metadata URLs

## What To Do Next

1. Restart Codex so it discovers the new skills.
2. Open this workspace again.
3. Refine the product-level design in `docs/superpowers/` when scope changes.
4. Use the existing OpenSpec change to drive the first implementation slice.
5. Begin code scaffolding from the validated OpenSpec tasks.

## How The Two Layers Work Together

- `docs/superpowers/` is the product and roadmap layer.
- `openspec/changes/` is the execution slice layer.
- Start broad in Superpowers, then narrow to a concrete OpenSpec change before
  coding.
- Keep the two in sync whenever scope or architecture changes.

## Current OpenSpec Change

- Active change:
  `openspec/changes/bootstrap-personal-blog-foundation/`
- Status: all artifacts complete and validated
- Scope: repository foundation, content publishing model, and the initial site
  structure for a personal blog

## Recommended Prompt Sequence

Use prompts like these in Codex:

### 1. Refine The Product Design

```text
Use brainstorming to refine docs/superpowers/specs/2026-04-06-personal-blog-design.md.
Keep the project as a personal website for a programmer with blog posts, travel writing, ideas, and a portfolio.
Add my latest content and brand goals, and remove assumptions that no longer hold.
```

### 2. Expand The Execution Plan

```text
Use writing-plans to expand docs/superpowers/plans/2026-04-06-personal-blog.md
based on docs/superpowers/specs/2026-04-06-personal-blog-design.md.
Break the work into small implementation tasks with clear verification steps.
```

### 3. Explore Or Refine The OpenSpec Change

```text
Use openspec-explore on bootstrap-personal-blog-foundation and compare it
with docs/superpowers/plans/2026-04-06-personal-blog.md.
Call out anything missing before implementation starts.
```

### 4. Start The First Implementation Slice

```text
Use openspec-apply-change for bootstrap-personal-blog-foundation.
Implement the tasks in order and keep the repository on the default stack unless
I override it.
```

### 5. Review Before Moving On

```text
Use code-review and verification-before-completion on the work completed for
bootstrap-personal-blog-foundation.
Call out any gaps against both OpenSpec and docs/superpowers before continuing.
```

## Working Habit

- When you change scope, update the spec first.
- When you change implementation direction, update the plan next.
- When a slice becomes implementation-ready, capture it as an OpenSpec change.
- When an OpenSpec change is approved, implement only that change or one task
  group at a time.
- Keep the repo in a state that can be tested after each chunk.
