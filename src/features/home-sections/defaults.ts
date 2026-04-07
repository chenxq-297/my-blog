export type HomeSectionKeyDefaults =
  | "HERO"
  | "LATEST_WRITING"
  | "FROM_THE_ROAD"
  | "SELECTED_WORK";

export type HomeSectionSourceCollectionDefaults =
  | "NONE"
  | "MIXED"
  | "BLOG"
  | "TRAVEL"
  | "NOTES"
  | "PROJECTS";

export type ContentCollectionDefaults = "BLOG" | "TRAVEL" | "NOTES" | "PROJECTS";

export type HomeSectionItemKindDefaults = "STAT" | "PINNED_ENTRY" | "LINK";

export type HomeSectionItemDefaults =
  | {
      kind: "STAT";
      order: number;
      label: string;
      value: string;
    }
  | {
      kind: "PINNED_ENTRY";
      order: number;
      contentCollection: ContentCollectionDefaults;
      slug: string;
    }
  | {
      kind: "LINK";
      order: number;
      label: string;
      href: string;
    };

export type HomeSectionDefaults = {
  key: HomeSectionKeyDefaults;
  eyebrow?: string | null;
  title: string;
  description?: string | null;
  isEnabled: boolean;
  order: number;
  sourceCollection: HomeSectionSourceCollectionDefaults;
  maxItems: number;
  items: HomeSectionItemDefaults[];
};

export const defaultHomeSections: HomeSectionDefaults[] = [
  {
    key: "HERO",
    eyebrow: "Catalogue",
    title: "Build a site that stays calm under change",
    description:
      "A long-term logbook for shipping software, collecting travel notes, and keeping ideas small enough to iterate.",
    isEnabled: true,
    order: 0,
    sourceCollection: "NONE",
    maxItems: 0,
    items: [
      { kind: "STAT", order: 0, label: "Base", value: "Shanghai" },
      { kind: "STAT", order: 1, label: "Mode", value: "Specs-first" },
      { kind: "STAT", order: 2, label: "Focus", value: "Writing + Building" },
    ],
  },
  {
    key: "LATEST_WRITING",
    eyebrow: "Latest writing",
    title: "Start with the things you publish most often",
    description: "Essays and short notes, pulled from the current file-based collections.",
    isEnabled: true,
    order: 1,
    sourceCollection: "MIXED",
    maxItems: 2,
    items: [
      { kind: "PINNED_ENTRY", order: 0, contentCollection: "BLOG", slug: "specs-first-personal-site" },
      { kind: "PINNED_ENTRY", order: 1, contentCollection: "NOTES", slug: "ai-coding-needs-structure" },
    ],
  },
  {
    key: "FROM_THE_ROAD",
    eyebrow: "From the road",
    title: "Travel stays photo-led, but still readable",
    description: "A small set of entries that are easy to revisit later.",
    isEnabled: true,
    order: 2,
    sourceCollection: "TRAVEL",
    maxItems: 2,
    items: [{ kind: "PINNED_ENTRY", order: 0, contentCollection: "TRAVEL", slug: "tokyo-after-midnight" }],
  },
  {
    key: "SELECTED_WORK",
    eyebrow: "Selected work",
    title: "Case studies over screenshots",
    description: "Projects that explain context, tradeoffs, and results.",
    isEnabled: true,
    order: 3,
    sourceCollection: "PROJECTS",
    maxItems: 2,
    items: [{ kind: "PINNED_ENTRY", order: 0, contentCollection: "PROJECTS", slug: "codex-provider-sync" }],
  },
];

