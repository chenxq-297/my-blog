import { describe, expect, it } from "vitest";
import { aboutPageSchema } from "../src/features/about/schema";

describe("about page schema", () => {
  it("accepts multiple principles", () => {
    const parsed = aboutPageSchema.parse({
      eyebrow: "About the operator",
      title: "A programmer who keeps engineering and expression close together.",
      description: "A long-term public notebook.",
      profileHeading: "Profile",
      profileBody: "Profile body",
      profileBodySecondary: "Profile body secondary",
      focusHeading: "Current focus",
      focusBody: "Focus body",
      principlesHeading: "Working principles",
      principles: ["One", "Two", "Three"],
    });

    expect(parsed.principles).toHaveLength(3);
  });
});
