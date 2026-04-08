import { describe, expect, it } from "vitest";

import { siteSettingsSchema } from "../src/features/site-config/schema";
import { buildMetadata } from "../src/lib/site";

const baseInput = {
  siteName: "Your Name",
  role: "Software Engineer",
  location: "Shanghai / Remote",
  title: "Code, travel, and notes in progress",
  description: "Long-form writing and project notes.",
  url: "http://localhost:3000",
  email: "owner@example.com",
  intro: "A personal site.",
  status: "Currently shipping.",
  locale: "zh_CN",
  navigation: [{ label: "Home", href: "/", sortOrder: 0, isVisible: true }],
  socialLinks: [
    {
      label: "GitHub",
      href: "https://github.com/example",
      sortOrder: 0,
      isVisible: true,
    },
  ],
};

describe("site settings schema", () => {
  it("accepts valid public site settings", () => {
    const parsed = siteSettingsSchema.parse(baseInput);

    expect(parsed.navigation).toHaveLength(1);
  });

  it("rejects duplicate sortOrder in navigation", () => {
    expect(() =>
      siteSettingsSchema.parse({
        ...baseInput,
        navigation: [
          { label: "Home", href: "/", sortOrder: 0, isVisible: true },
          { label: "About", href: "/about", sortOrder: 0, isVisible: true },
        ],
      }),
    ).toThrow();
  });

  it("rejects duplicate sortOrder in socialLinks", () => {
    expect(() =>
      siteSettingsSchema.parse({
        ...baseInput,
        socialLinks: [
          { label: "GitHub", href: "https://github.com/example", sortOrder: 0, isVisible: true },
          {
            label: "LinkedIn",
            href: "https://linkedin.com/in/example",
            sortOrder: 0,
            isVisible: true,
          },
        ],
      }),
    ).toThrow();
  });

  it("rejects duplicate href in navigation", () => {
    expect(() =>
      siteSettingsSchema.parse({
        ...baseInput,
        navigation: [
          { label: "Home", href: "/", sortOrder: 0, isVisible: true },
          { label: "Home duplicate", href: "/", sortOrder: 1, isVisible: true },
        ],
      }),
    ).toThrow();
  });

  it("rejects duplicate href in socialLinks", () => {
    expect(() =>
      siteSettingsSchema.parse({
        ...baseInput,
        socialLinks: [
          { label: "GitHub", href: "https://github.com/example", sortOrder: 0, isVisible: true },
          {
            label: "GitHub mirror",
            href: "https://github.com/example",
            sortOrder: 1,
            isVisible: true,
          },
        ],
      }),
    ).toThrow();
  });
});

describe("site metadata helpers", () => {
  it("buildMetadata maps site settings to metadata fields", () => {
    const metadata = buildMetadata({
      siteName: "Your Name",
      title: "Code, travel, and notes",
      description: "Long-form writing and project notes.",
      url: "https://example.com",
      locale: "zh_CN",
    });

    expect(metadata.title).toMatchObject({
      default: "Your Name | Code, travel, and notes",
      template: "%s | Your Name",
    });
    expect(metadata.description).toBe("Long-form writing and project notes.");
    expect(metadata.openGraph).toMatchObject({
      siteName: "Your Name",
      url: "https://example.com",
      locale: "zh_CN",
    });
  });
});
