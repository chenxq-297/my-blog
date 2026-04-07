import { describe, expect, it } from "vitest";

import {
  defaultNavItems,
  defaultSiteSettings,
  defaultSocialLinks,
} from "../src/features/site-config/defaults";
import { defaultHomeSections } from "../src/features/home-sections/defaults";
import { defaultAboutPage } from "../src/features/about/defaults";

describe("site configuration defaults", () => {
  it("matches the Phase 1 SiteSettings contract", () => {
    expect(defaultSiteSettings).toMatchObject({
      siteName: expect.any(String),
      role: expect.any(String),
      location: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      url: expect.any(String),
      email: expect.any(String),
    });

    expect(defaultSiteSettings.siteName.length).toBeGreaterThan(0);
  });

  it("matches the Phase 1 NavItem contract", () => {
    expect(defaultNavItems.length).toBeGreaterThanOrEqual(5);

    const hrefs = defaultNavItems.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/about");
    expect(hrefs).toContain("/blog");
    expect(hrefs).toContain("/travel");
    expect(hrefs).toContain("/notes");
    expect(hrefs).toContain("/projects");

    defaultNavItems.forEach((item, index) => {
      expect(item).toMatchObject({
        href: expect.any(String),
        label: expect.any(String),
        isVisible: true,
        sortOrder: index,
      });
    });
  });

  it("matches the Phase 1 SocialLink contract", () => {
    expect(defaultSocialLinks.length).toBeGreaterThanOrEqual(2);

    const hrefs = defaultSocialLinks.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    defaultSocialLinks.forEach((item, index) => {
      expect(item).toMatchObject({
        href: expect.any(String),
        label: expect.any(String),
        isVisible: true,
        sortOrder: index,
      });
    });
  });

  it("matches the Phase 1 HomeSection contract", () => {
    // Contract keys + ordering: HERO, LATEST_WRITING, TRAVEL, SELECTED_WORK
    expect(defaultHomeSections.map((section) => section.key)).toEqual([
      "HERO",
      "LATEST_WRITING",
      "TRAVEL",
      "SELECTED_WORK",
    ]);

    defaultHomeSections.forEach((section, index) => {
      expect(section).toMatchObject({
        key: expect.any(String),
        title: expect.any(String),
        isVisible: true,
        sortOrder: index,
      });
    });

    const hero = defaultHomeSections[0];
    expect(hero.key).toBe("HERO");
    expect(hero.sourceCollection).toBeNull();
    expect(hero.maxItems).toBeNull();
    expect(hero.items.length).toBeGreaterThan(0);

    hero.items.forEach((item, index) => {
      expect(item).toMatchObject({
        kind: "HERO_STAT",
        sortOrder: index,
        label: expect.any(String),
        value: expect.any(String),
      });
    });

    const latestWriting = defaultHomeSections[1];
    expect(latestWriting.key).toBe("LATEST_WRITING");
    expect(latestWriting.sourceCollection).toBe("BLOG_AND_NOTES");
    expect(latestWriting.maxItems).toBe(2);

    const travel = defaultHomeSections[2];
    expect(travel.key).toBe("TRAVEL");
    expect(travel.sourceCollection).toBe("TRAVEL");
    expect(travel.maxItems).toBe(2);

    const selectedWork = defaultHomeSections[3];
    expect(selectedWork.key).toBe("SELECTED_WORK");
    expect(selectedWork.sourceCollection).toBe("PROJECTS");
    expect(selectedWork.maxItems).toBe(2);
  });

  it("matches the Phase 1 AboutPage contract", () => {
    expect(defaultAboutPage).toMatchObject({
      eyebrow: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      profileHeading: expect.any(String),
      profileBody: expect.any(String),
      profileBodySecondary: expect.any(String),
      focusHeading: expect.any(String),
      focusBody: expect.any(String),
      principlesHeading: expect.any(String),
      principles: expect.any(Array),
    });

    expect(defaultAboutPage.principles.length).toBeGreaterThanOrEqual(3);
    expect(defaultAboutPage.principles.every((item) => typeof item === "string")).toBe(true);
    expect(defaultAboutPage.profileBody).toContain("\n\n");
  });
});
