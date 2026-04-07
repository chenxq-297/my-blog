## ADDED Requirements

### Requirement: Site exposes the main public sections
The site MUST expose clear top-level routes for home, about, blog, travel,
ideas, and projects.

#### Scenario: Reader lands on the home page
- **WHEN** a reader opens the homepage
- **THEN** the page communicates who the site owner is
- **THEN** the page highlights the main content sections and selected items

### Requirement: Portfolio presentation supports project discovery
The site MUST provide both an overview of selected projects and dedicated detail
pages for each showcased project.

#### Scenario: Reader browses the project index
- **WHEN** a reader visits the projects section
- **THEN** they can scan a set of selected projects with summaries
- **THEN** they can navigate into a detailed page for each project

### Requirement: Site supports search-friendly and share-friendly metadata
The site MUST provide metadata that helps content display correctly in search
and social previews.

#### Scenario: Page metadata is generated
- **WHEN** a public page or content detail page is rendered
- **THEN** the site provides page-specific title and description metadata
- **THEN** the site can participate in sitemap and feed generation
