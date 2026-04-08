import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { homeSectionSchema } from "../src/features/home-sections/schema";

const mockGetHomeSections = vi.fn();
const mockGetSiteSettings = vi.fn();

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => createElement("a", { href, ...props }, children),
}));

vi.mock("@/features/home-sections/queries", () => ({
  getHomeSections: mockGetHomeSections,
}));

vi.mock("@/features/site-config/queries", () => ({
  getSiteSettings: mockGetSiteSettings,
}));

const baseSiteSettings = {
  siteName: "Configured Site",
  role: "Software Engineer",
  location: "Shanghai",
  title: "Configured title",
  description: "Configured description",
  url: "http://localhost:3000",
  email: "owner@example.com",
  intro: "Legacy intro copy",
  status: "Shipping",
  locale: "en_US",
  navigation: [
    { label: "Home", href: "/", sortOrder: 0, isVisible: true },
    { label: "Blog", href: "/blog", sortOrder: 1, isVisible: true },
    { label: "Travel", href: "/travel", sortOrder: 2, isVisible: true },
    { label: "Projects", href: "/projects", sortOrder: 3, isVisible: true },
  ],
  socialLinks: [],
};

const makeCard = (label: string) => ({
  href: `/${label.toLowerCase().replaceAll(" ", "-")}`,
  title: `${label} card`,
  summary: `${label} summary`,
  date: "2026-01-01",
  accent: "cyan" as const,
  meta: `${label} meta`,
  tags: [label],
});

const makeHomeSections = (overrides?: {
  sections?: Array<{
    key: "HERO" | "LATEST_WRITING" | "TRAVEL" | "SELECTED_WORK";
    eyebrow: string | null;
    title: string;
    description: string | null;
    isVisible: boolean;
    sortOrder: number;
    sourceCollection: "BLOG_AND_NOTES" | "TRAVEL" | "PROJECTS" | null;
    maxItems: number | null;
  }>;
  hero?: {
    key: "HERO";
    eyebrow: string | null;
    title: string;
    description: string | null;
    isVisible: boolean;
    sortOrder: number;
    sourceCollection: null;
    maxItems: null;
  };
}) => {
  const hero = {
    key: "HERO" as const,
    eyebrow: "Hero eyebrow",
    title: "Hero title",
    description: "Managed hero description",
    isVisible: true,
    sortOrder: 0,
    sourceCollection: null,
    maxItems: null,
    ...(overrides?.hero ?? {}),
  };

  const sections =
    overrides?.sections ??
    [
      hero,
      {
        key: "LATEST_WRITING" as const,
        eyebrow: "Latest writing eyebrow",
        title: "Latest writing title",
        description: "Latest writing description",
        isVisible: true,
        sortOrder: 1,
        sourceCollection: "BLOG_AND_NOTES" as const,
        maxItems: 2,
      },
      {
        key: "TRAVEL" as const,
        eyebrow: "Travel eyebrow",
        title: "Travel title",
        description: "Travel description",
        isVisible: true,
        sortOrder: 2,
        sourceCollection: "TRAVEL" as const,
        maxItems: 2,
      },
      {
        key: "SELECTED_WORK" as const,
        eyebrow: "Selected work eyebrow",
        title: "Selected work title",
        description: "Selected work description",
        isVisible: true,
        sortOrder: 3,
        sourceCollection: "PROJECTS" as const,
        maxItems: 2,
      },
    ];

  return {
    sections,
    hero,
    latestWriting: {
      key: "LATEST_WRITING" as const,
      eyebrow: "Latest writing eyebrow",
      title: "Latest writing title",
      description: "Latest writing description",
      isVisible: true,
      sortOrder: 1,
      sourceCollection: "BLOG_AND_NOTES" as const,
      maxItems: 2,
      cards: [makeCard("Latest writing")],
    },
    travel: {
      key: "TRAVEL" as const,
      eyebrow: "Travel eyebrow",
      title: "Travel title",
      description: "Travel description",
      isVisible: true,
      sortOrder: 2,
      sourceCollection: "TRAVEL" as const,
      maxItems: 2,
      cards: [makeCard("Travel")],
    },
    selectedWork: {
      key: "SELECTED_WORK" as const,
      eyebrow: "Selected work eyebrow",
      title: "Selected work title",
      description: "Selected work description",
      isVisible: true,
      sortOrder: 3,
      sourceCollection: "PROJECTS" as const,
      maxItems: 2,
      cards: [makeCard("Selected work")],
    },
  };
};

const renderHomePage = async () => {
  const module = await import("../src/app/page");
  const element = await module.default();
  return renderToStaticMarkup(element);
};

describe("home section schema", () => {
  it("accepts a visible section with a positive item limit", () => {
    const parsed = homeSectionSchema.parse({
      key: "LATEST_WRITING",
      eyebrow: "Latest writing",
      title: "Start with the writing that best represents you.",
      description: "Long-form posts and shorter notes stay easy to revisit.",
      isVisible: true,
      sortOrder: 1,
      sourceCollection: "BLOG_AND_NOTES",
      maxItems: 2,
    });

    expect(parsed.maxItems).toBe(2);
  });
});

describe("home page admin-managed contract", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders non-hero sections in admin sort order", async () => {
    mockGetSiteSettings.mockResolvedValue(baseSiteSettings);
    mockGetHomeSections.mockResolvedValue(
      makeHomeSections({
        sections: [
          {
            key: "HERO",
            eyebrow: "Hero eyebrow",
            title: "Hero title",
            description: "Managed hero description",
            isVisible: true,
            sortOrder: 0,
            sourceCollection: null,
            maxItems: null,
          },
          {
            key: "TRAVEL",
            eyebrow: "Travel eyebrow",
            title: "Travel title",
            description: "Travel description",
            isVisible: true,
            sortOrder: 1,
            sourceCollection: "TRAVEL",
            maxItems: 2,
          },
          {
            key: "SELECTED_WORK",
            eyebrow: "Selected work eyebrow",
            title: "Selected work title",
            description: "Selected work description",
            isVisible: true,
            sortOrder: 2,
            sourceCollection: "PROJECTS",
            maxItems: 2,
          },
          {
            key: "LATEST_WRITING",
            eyebrow: "Latest writing eyebrow",
            title: "Latest writing title",
            description: "Latest writing description",
            isVisible: true,
            sortOrder: 3,
            sourceCollection: "BLOG_AND_NOTES",
            maxItems: 2,
          },
        ],
      }),
    );

    const html = await renderHomePage();
    const travelIndex = html.indexOf("Travel title");
    const selectedWorkIndex = html.indexOf("Selected work title");
    const latestWritingIndex = html.indexOf("Latest writing title");

    expect(travelIndex).toBeGreaterThan(-1);
    expect(selectedWorkIndex).toBeGreaterThan(travelIndex);
    expect(latestWritingIndex).toBeGreaterThan(selectedWorkIndex);
  });

  it("uses hero description as visible hero body copy", async () => {
    mockGetSiteSettings.mockResolvedValue({
      ...baseSiteSettings,
      intro: "Legacy intro that should not render as hero body",
    });
    mockGetHomeSections.mockResolvedValue(
      makeHomeSections({
        hero: {
          key: "HERO",
          eyebrow: "Hero eyebrow",
          title: "Hero title",
          description: "Hero description from home sections",
          isVisible: true,
          sortOrder: 0,
          sourceCollection: null,
          maxItems: null,
        },
      }),
    );

    const html = await renderHomePage();

    expect(html).toContain("Hero description from home sections");
    expect(html).not.toContain("Legacy intro that should not render as hero body");
  });

  it("applies hero visibility to public hero output", async () => {
    mockGetSiteSettings.mockResolvedValue(baseSiteSettings);
    mockGetHomeSections.mockResolvedValue(
      makeHomeSections({
        hero: {
          key: "HERO",
          eyebrow: "Hidden eyebrow",
          title: "Hidden hero title",
          description: "Hidden hero body",
          isVisible: false,
          sortOrder: 0,
          sourceCollection: null,
          maxItems: null,
        },
      }),
    );

    const html = await renderHomePage();

    expect(html).not.toContain("Hidden hero title");
    expect(html).not.toContain("Hidden hero body");
    expect(html).toContain("Configured Site");
  });
});
