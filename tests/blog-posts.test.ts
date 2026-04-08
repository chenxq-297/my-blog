import type { BlogPost } from "../src/lib/content";
import { describe, expect, it } from "vitest";
import { mergeBlogPostSources } from "../src/features/blog-posts/public";
import { managedBlogPostSchema } from "../src/features/blog-posts/schema";

const makeFileBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  slug: "file-post",
  body: "File body",
  href: "/blog/file-post",
  absoluteHref: "http://localhost:3000/blog/file-post",
  accent: "cyan",
  title: "File title",
  summary: "File summary",
  date: "2026-04-01T00:00:00.000Z",
  featured: false,
  published: true,
  tags: ["file"],
  category: "Essay",
  readingTime: "4 min",
  ...overrides,
});

const makeManagedBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  slug: "managed-post",
  body: "Managed body",
  href: "/blog/managed-post",
  absoluteHref: "http://localhost:3000/blog/managed-post",
  accent: "violet",
  title: "Managed title",
  summary: "Managed summary",
  date: "2026-04-08T00:00:00.000Z",
  featured: true,
  published: true,
  tags: ["managed"],
  category: "Engineering",
  readingTime: "6 min",
  ...overrides,
});

describe("managed blog post schema", () => {
  it("accepts a valid published blog post payload", () => {
    const parsed = managedBlogPostSchema.parse({
      title: "A database-backed post",
      slug: "database-backed-post",
      summary: "A short summary for the public blog card.",
      body: "## Hello\n\nThis post came from the admin backend.",
      category: "Engineering",
      readingTime: "6 min",
      publishedAt: "2026-04-08",
      accent: "violet",
      tags: ["admin", "blog"],
      featured: true,
      published: true,
    });

    expect(parsed.slug).toBe("database-backed-post");
    expect(parsed.tags).toEqual(["admin", "blog"]);
  });
});

describe("managed and file blog merging", () => {
  it("prefers managed posts on slug conflicts and hides drafts", () => {
    const merged = mergeBlogPostSources(
      [
        makeManagedBlogPost({
          slug: "same-slug",
          title: "Managed wins",
        }),
        makeManagedBlogPost({
          slug: "draft-slug",
          title: "Draft should stay private",
          published: false,
        }),
      ],
      [
        makeFileBlogPost({
          slug: "same-slug",
          title: "File fallback",
        }),
        makeFileBlogPost({
          slug: "file-only",
          title: "File only post",
        }),
        makeFileBlogPost({
          slug: "draft-slug",
          title: "File should not leak through a managed draft",
        }),
      ],
    );

    expect(merged.map((post) => post.slug)).toEqual(["same-slug", "file-only"]);
    expect(merged[0]?.title).toBe("Managed wins");
    expect(merged.some((post) => post.slug === "draft-slug")).toBe(false);
  });
});
