# Personal Blog Design

## Overview

Build a personal website for a software engineer. The site should feel like a
home base for long-form writing, travel stories, short ideas, and selected
projects. It should be editorial, personal, and easy to publish to over time.

## Product Goals

1. Present a clear personal identity as a developer.
2. Publish technical writing, reflections, and ideas in a durable format.
3. Capture travel experiences in a way that is visual and story-driven.
4. Showcase projects with enough context to reflect craft and decision-making.
5. Keep publishing friction low so the site stays alive over time.

## Assumptions For V1

- The site is for a single owner and public readers.
- The initial publishing workflow is file-based, not CMS-first.
- The primary experience is a public web site with responsive layouts.
- Content types include long-form posts, short notes, travel entries, and
  project pages.
- Comments and newsletter are optional and should not block V1.
- Chinese and English content may both appear over time, so content structure
  should stay language-flexible.

## Audience

| Audience | Primary Need | What They Should Find |
| --- | --- | --- |
| Recruiters or hiring managers | Quick understanding of the owner | Intro, selected projects, background, contact links |
| Fellow developers | Useful writing and technical work | Blog posts, project case studies, notes |
| Friends or curious readers | Personal perspective | Travel stories, essays, ideas |
| The owner | A lasting public notebook | Easy publishing workflow and coherent content structure |

## Core Modules

### 1. Site Foundation And Identity

- Global layout, navigation, footer, theme, and design language.
- Clear home page introducing who you are and what the site contains.
- About page with profile, background, and current interests.

### 2. Blog

- Long-form posts for programming, thinking, or essays.
- Support rich formatting, code blocks, tags, dates, and summaries.
- Index pages and post detail pages should be easy to browse.

### 3. Travel

- Dedicated travel entries with places, dates, photos, and story structure.
- Travel content should feel distinct from technical posts while still fitting
  the same overall site design.

### 4. Ideas / Notes

- Short-form writing for unfinished thoughts, experiments, and observations.
- Low-friction publishing model so ideas can be captured quickly.

### 5. Portfolio

- Project index and detail pages for selected work.
- Each project should show the problem, stack, process, and outcomes.

### 6. Discovery And SEO

- Search-engine-friendly metadata, sitemap, RSS, and link previews.
- Good page titles, descriptions, and content structure across sections.

## Core User Flows

### Reader Flow

1. Land on the homepage from social, search, or direct links.
2. Understand who the site belongs to and what kinds of content exist.
3. Browse into blog posts, travel stories, ideas, or project pages.
4. Continue exploring through related content and clear navigation.

### Owner Flow

1. Add a new content file locally.
2. Preview the content in development.
3. Publish without needing a separate admin system.

## Content Model

- `AuthorProfile`: personal identity, bio, links, and profile metadata.
- `BlogPost`: long-form article with title, summary, date, tags, and body.
- `TravelEntry`: travel story with destination, dates, cover image, and body.
- `Note`: short-form entry with date, topic, and compact content body.
- `ProjectCaseStudy`: project showcase with summary, stack, links, and write-up.

## Functional Requirements

### Site Structure

- The site must expose clear top-level routes for home, about, blog, travel,
  ideas, and projects.
- The site must let readers move between sections without confusion.

### Content Publishing

- The site must support file-based content authoring for all core content types.
- Each content type must define predictable metadata.
- Long-form and short-form content should be rendered consistently.

### Portfolio Presentation

- The site must support project index and project detail views.
- Each project page must provide enough context to understand the work.

### Discovery

- The site must generate metadata that helps posts and pages render well in
  search and social previews.
- The site should support RSS and sitemap generation in V1.

## Non-Functional Requirements

- Pages should feel fast and responsive on mobile and desktop.
- The content model should be easy to extend without a heavy migration process.
- Publishing should remain simple enough for a single owner to maintain.
- Core routes and content rendering should be easy to verify with automated
  tests.
- The visual direction should feel personal and editorial rather than generic.

## Acceptance Criteria For V1

- Readers can browse home, about, blog, travel, ideas, and project sections.
- The owner can add content through local files with predictable metadata.
- At least one sample item exists for each main content type.
- The site exposes metadata, sitemap, and RSS or equivalent feed support.
- Tests cover at least one happy path for routing, content loading, and a core
  section page.
