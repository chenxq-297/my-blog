import { describe, expect, it } from "vitest";

import {
  defaultNavItems,
  defaultSiteSettings,
  defaultSocialLinks,
} from "../src/features/site-config/defaults";
import { defaultHomeSections } from "../src/features/home-sections/defaults";
import { defaultAboutPage } from "../src/features/about/defaults";

describe("site configuration defaults", () => {
  it("defines a non-empty baseline SiteSettings payload", () => {
    expect(defaultSiteSettings).toMatchObject({
      name: expect.any(String),
      role: expect.any(String),
      location: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      url: expect.any(String),
      email: expect.any(String),
    });

    expect(defaultSiteSettings.name.length).toBeGreaterThan(0);
  });

  it("defines ordered navigation items with stable core routes", () => {
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
        order: index,
      });
    });
  });

  it("defines social links suitable for the public footer", () => {
    expect(defaultSocialLinks.length).toBeGreaterThanOrEqual(2);

    const hrefs = defaultSocialLinks.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);

    defaultSocialLinks.forEach((item, index) => {
      expect(item).toMatchObject({
        href: expect.any(String),
        label: expect.any(String),
        order: index,
      });
    });
  });

  it("defines homepage sections with unique keys and deterministic ordering", () => {
    expect(defaultHomeSections.length).toBeGreaterThanOrEqual(3);

    const keys = defaultHomeSections.map((section) => section.key);
    expect(new Set(keys).size).toBe(keys.length);

    defaultHomeSections.forEach((section, index) => {
      expect(section).toMatchObject({
        key: expect.any(String),
        title: expect.any(String),
        isEnabled: true,
        order: index,
      });
    });

    const hero = defaultHomeSections.find((section) => section.key === "HERO");
    expect(hero).toBeTruthy();
    expect(hero?.items.length).toBeGreaterThan(0);
    hero?.items.forEach((item, index) => {
      expect(item).toMatchObject({
        kind: "STAT",
        order: index,
        label: expect.any(String),
        value: expect.any(String),
      });
    });
  });

  it("defines About page defaults with working principles", () => {
    expect(defaultAboutPage).toMatchObject({
      eyebrow: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      profileHeading: expect.any(String),
      profileBody: expect.any(Array),
      focusHeading: expect.any(String),
      focusBody: expect.any(String),
      principlesHeading: expect.any(String),
      principles: expect.any(Array),
    });

    expect(defaultAboutPage.principles.length).toBeGreaterThanOrEqual(3);
  });
});

