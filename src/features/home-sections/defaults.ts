export type HomeSectionKeyDefaults =
  | "HERO"
  | "LATEST_WRITING"
  | "TRAVEL"
  | "SELECTED_WORK";

export type HomeSectionSourceCollectionDefaults =
  | "BLOG_AND_NOTES"
  | "TRAVEL"
  | "PROJECTS";

export type ContentCollectionDefaults = "BLOG" | "TRAVEL" | "NOTES" | "PROJECTS";

export type HomeSectionItemKindDefaults = "HERO_STAT" | "PINNED_ENTRY" | "LINK";

export type HomeSectionItemDefaults =
  | {
      kind: "HERO_STAT";
      sortOrder: number;
      label: string;
      value: string;
    }
  | {
      kind: "PINNED_ENTRY";
      sortOrder: number;
      contentCollection: ContentCollectionDefaults;
      slug: string;
    }
  | {
      kind: "LINK";
      sortOrder: number;
      label: string;
      href: string;
    };

export type HomeSectionDefaults = {
  key: HomeSectionKeyDefaults;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  isVisible: boolean;
  sortOrder: number;
  sourceCollection: HomeSectionSourceCollectionDefaults | null;
  maxItems: number | null;
  items: HomeSectionItemDefaults[];
};

export const defaultHomeSections: HomeSectionDefaults[] = [
  {
    key: "HERO",
    eyebrow: "Catalogue",
    title: "Build a site that stays calm under change",
    description:
      "A long-term logbook for shipping software, collecting travel notes, and keeping ideas small enough to iterate.",
    isVisible: true,
    sortOrder: 0,
    sourceCollection: null,
    maxItems: null,
    items: [
      { kind: "HERO_STAT", sortOrder: 0, label: "Base", value: "Shanghai" },
      { kind: "HERO_STAT", sortOrder: 1, label: "Mode", value: "Specs-first" },
      { kind: "HERO_STAT", sortOrder: 2, label: "Focus", value: "Writing + Building" },
    ],
  },
  {
    key: "LATEST_WRITING",
    eyebrow: "Latest writing",
    title: "Start with the things you publish most often",
    description: "Essays and short notes, pulled from the current file-based collections.",
    isVisible: true,
    sortOrder: 1,
    sourceCollection: "BLOG_AND_NOTES",
    maxItems: 2,
    items: [
      { kind: "PINNED_ENTRY", sortOrder: 0, contentCollection: "BLOG", slug: "specs-first-personal-site" },
      { kind: "PINNED_ENTRY", sortOrder: 1, contentCollection: "NOTES", slug: "ai-coding-needs-structure" },
    ],
  },
  {
    key: "TRAVEL",
    eyebrow: "From the road",
    title: "Travel stays photo-led, but still readable",
    description: "A small set of entries that are easy to revisit later.",
    isVisible: true,
    sortOrder: 2,
    sourceCollection: "TRAVEL",
    maxItems: 2,
    items: [{ kind: "PINNED_ENTRY", sortOrder: 0, contentCollection: "TRAVEL", slug: "tokyo-after-midnight" }],
  },
  {
    key: "SELECTED_WORK",
    eyebrow: "Selected work",
    title: "Case studies over screenshots",
    description: "Projects that explain context, tradeoffs, and results.",
    isVisible: true,
    sortOrder: 3,
    sourceCollection: "PROJECTS",
    maxItems: 2,
    items: [{ kind: "PINNED_ENTRY", sortOrder: 0, contentCollection: "PROJECTS", slug: "codex-provider-sync" }],
  },
];
