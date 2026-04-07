## ADDED Requirements

### Requirement: Site supports file-based content publishing
The site MUST support file-based publishing for the core content types: blog
posts, travel entries, ideas, and project case studies.

#### Scenario: Owner adds a content file
- **WHEN** the site owner adds a valid local content file for a supported
  content type
- **THEN** the site can load and render that content in development

### Requirement: Content collections define predictable metadata
The site MUST validate and expose predictable metadata for each supported
content type.

#### Scenario: Blog post metadata is loaded
- **WHEN** the site processes a blog post entry
- **THEN** it extracts required metadata such as title, slug, date, and summary
- **THEN** invalid or incomplete entries are surfaced during development

#### Scenario: Travel entry metadata is loaded
- **WHEN** the site processes a travel entry
- **THEN** it extracts travel-specific metadata such as destination, date or
  date range, and presentation media references

### Requirement: Content is rendered consistently by type
The site MUST render long-form and short-form content consistently within each
section.

#### Scenario: Reader opens a project case study
- **WHEN** a reader visits a project detail page
- **THEN** the site renders the project content using the project-specific
  layout and metadata
- **THEN** the page communicates enough context to understand the work
