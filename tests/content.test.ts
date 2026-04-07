import { describe, expect, it } from "vitest";
import {
  getAllEntries,
  getBlogPosts,
  getProjectEntries,
  getTravelEntries,
} from "../src/lib/content";

describe("content collections", () => {
  it("loads at least one blog post", async () => {
    const posts = await getBlogPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0]).toMatchObject({
      title: expect.any(String),
      href: expect.stringContaining("/blog/"),
    });
  });

  it("loads travel entries with destination metadata", async () => {
    const entries = await getTravelEntries();

    expect(entries[0]?.destination).toBeTruthy();
  });

  it("loads project entries with stack information", async () => {
    const projects = await getProjectEntries();

    expect(projects[0]?.stack.length).toBeGreaterThan(0);
  });

  it("merges all collections into a dated feed", async () => {
    const entries = await getAllEntries();

    expect(entries.length).toBeGreaterThanOrEqual(4);
    expect(new Date(entries[0].date).getTime()).toBeGreaterThanOrEqual(
      new Date(entries[entries.length - 1].date).getTime(),
    );
  });
});
