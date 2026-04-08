import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache";
import { getPublicBlogPosts } from "@/features/blog-posts/queries";
import {
  getNoteEntries,
  getProjectEntries,
  getTravelEntries,
  type NoteEntry,
  type ProjectEntry,
  type TravelEntry,
} from "@/lib/content";
import type { BlogPost } from "@/lib/content";
import { db } from "@/lib/db";
import { sortByDateDescending } from "@/lib/utils";
import { defaultHomeSections } from "./defaults";
import {
  homeSectionKeySchema,
  homeSectionWithItemsSchema,
  type HomeSection,
  type HomeSectionWithItems,
} from "./schema";

type HomeCard = {
  href: string;
  title: string;
  summary: string;
  date: string;
  accent: "cyan" | "violet" | "lime";
  meta: string;
  tags: string[];
};

type HomeSectionWithCards = HomeSection & {
  cards: HomeCard[];
};

export type HomeSectionsView = {
  sections: HomeSection[];
  hero: HomeSection;
  latestWriting: HomeSectionWithCards;
  travel: HomeSectionWithCards;
  selectedWork: HomeSectionWithCards;
};

const toBlogCard = (entry: BlogPost): HomeCard => ({
  href: entry.href,
  title: entry.title,
  summary: entry.summary,
  date: entry.date,
  accent: entry.accent,
  meta: entry.category,
  tags: entry.tags,
});

const toNoteCard = (entry: NoteEntry): HomeCard => ({
  href: entry.href,
  title: entry.title,
  summary: entry.summary,
  date: entry.date,
  accent: entry.accent,
  meta: entry.topic,
  tags: entry.tags,
});

const toTravelCard = (entry: TravelEntry): HomeCard => ({
  href: entry.href,
  title: entry.title,
  summary: entry.summary,
  date: entry.date,
  accent: entry.accent,
  meta: entry.destination,
  tags: entry.tags,
});

const toProjectCard = (entry: ProjectEntry): HomeCard => ({
  href: entry.href,
  title: entry.title,
  summary: entry.summary,
  date: entry.date,
  accent: entry.accent,
  meta: entry.status,
  tags: entry.stack,
});

const withLimit = <T,>(items: T[], maxItems: number | null) =>
  maxItems === null ? items : items.slice(0, maxItems);

const dedupeCards = (cards: HomeCard[]) => {
  const seen = new Set<string>();
  return cards.filter((card) => {
    if (seen.has(card.href)) {
      return false;
    }

    seen.add(card.href);
    return true;
  });
};

const findBySlug = <T extends { slug: string }>(entries: T[], slug: string) =>
  entries.find((entry) => entry.slug === slug) ?? null;

const stripItems = ({ items, ...section }: HomeSectionWithItems): HomeSection => {
  void items;
  return section;
};

const deriveCardsForSection = (
  section: HomeSectionWithItems,
  content: {
    blogPosts: BlogPost[];
    noteEntries: NoteEntry[];
    travelEntries: TravelEntry[];
    projectEntries: ProjectEntry[];
  },
) => {
  const fallbackCards =
    section.key === "LATEST_WRITING"
      ? sortByDateDescending([
          ...content.blogPosts.map(toBlogCard),
          ...content.noteEntries.map(toNoteCard),
        ])
      : section.key === "TRAVEL"
        ? content.travelEntries.map(toTravelCard)
        : section.key === "SELECTED_WORK"
          ? content.projectEntries.map(toProjectCard)
          : [];

  const pinnedCards = section.items
    .filter((item) => item.kind === "PINNED_ENTRY" && item.slug)
    .map((item) => {
      if (item.contentCollection === "BLOG") {
        const entry = findBySlug(content.blogPosts, item.slug as string);
        return entry ? toBlogCard(entry) : null;
      }

      if (item.contentCollection === "NOTES") {
        const entry = findBySlug(content.noteEntries, item.slug as string);
        return entry ? toNoteCard(entry) : null;
      }

      if (item.contentCollection === "TRAVEL") {
        const entry = findBySlug(content.travelEntries, item.slug as string);
        return entry ? toTravelCard(entry) : null;
      }

      if (item.contentCollection === "PROJECTS") {
        const entry = findBySlug(content.projectEntries, item.slug as string);
        return entry ? toProjectCard(entry) : null;
      }

      return null;
    })
    .filter((card): card is HomeCard => card !== null);

  if (pinnedCards.length > 0) {
    return withLimit(dedupeCards([...pinnedCards, ...fallbackCards]), section.maxItems);
  }

  return withLimit(fallbackCards, section.maxItems);
};

const readHomeSections = async (): Promise<HomeSectionsView> => {
  const [dbSections, blogPosts, noteEntries, travelEntries, projectEntries] = await Promise.all([
    db.homeSection.findMany({
      orderBy: {
        sortOrder: "asc",
      },
      include: {
        items: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    }),
    getPublicBlogPosts(),
    getNoteEntries(),
    getTravelEntries(),
    getProjectEntries(),
  ]);

  const fallbackSections = defaultHomeSections.map((section) =>
    homeSectionWithItemsSchema.parse(section),
  );

  const parsedDbSections = dbSections.map((section) =>
    homeSectionWithItemsSchema.parse({
      key: section.key,
      eyebrow: section.eyebrow,
      title: section.title,
      description: section.description,
      isVisible: section.isVisible,
      sortOrder: section.sortOrder,
      sourceCollection: section.sourceCollection,
      maxItems: section.maxItems,
      items: section.items.map((item) => ({
        kind: item.kind,
        sortOrder: item.sortOrder,
        label: item.label,
        value: item.value,
        href: item.href,
        contentCollection: item.contentCollection,
        slug: item.slug,
      })),
    }),
  );

  const dbByKey = new Map(parsedDbSections.map((section) => [section.key, section]));
  const mergedSections = homeSectionKeySchema.options
    .map((key) => dbByKey.get(key) ?? fallbackSections.find((section) => section.key === key))
    .filter((section): section is HomeSectionWithItems => Boolean(section))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const sections = mergedSections.map(stripItems);
  const sectionsByKey = new Map(mergedSections.map((section) => [section.key, section]));

  const heroSection = sectionsByKey.get("HERO") ?? fallbackSections[0];
  const latestWritingSection = sectionsByKey.get("LATEST_WRITING") ?? fallbackSections[1];
  const travelSection = sectionsByKey.get("TRAVEL") ?? fallbackSections[2];
  const selectedWorkSection = sectionsByKey.get("SELECTED_WORK") ?? fallbackSections[3];

  const content = {
    blogPosts,
    noteEntries,
    travelEntries,
    projectEntries,
  };

  const hero = stripItems(heroSection);
  const latestWriting = {
    ...stripItems(latestWritingSection),
    cards: deriveCardsForSection(latestWritingSection, content),
  };
  const travel = {
    ...stripItems(travelSection),
    cards: deriveCardsForSection(travelSection, content),
  };
  const selectedWork = {
    ...stripItems(selectedWorkSection),
    cards: deriveCardsForSection(selectedWorkSection, content),
  };

  return {
    sections,
    hero,
    latestWriting,
    travel,
    selectedWork,
  };
};

const getHomeSectionsCached = unstable_cache(readHomeSections, ["home-sections"], {
  tags: [cacheTags.home],
});

export const getHomeSections = async () => getHomeSectionsCached();
