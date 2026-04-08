import { unstable_cache } from "next/cache";
import type { ContentAccent } from "@prisma/client";
import type { BlogPost } from "@/lib/content";
import { getBlogPosts } from "@/lib/content";
import { db } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";
import { cacheTags } from "@/lib/cache";
import { managedBlogAccentSchema, managedBlogPostSchema, type ManagedBlogPost } from "./schema";
import { mergeBlogPostSources } from "./public";

type ManagedBlogListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
};

const tagsSchema = managedBlogPostSchema.shape.tags;

const accentFromDb: Record<ContentAccent, BlogPost["accent"]> = {
  CYAN: "cyan",
  VIOLET: "violet",
  LIME: "lime",
};

const accentToDb = {
  cyan: "CYAN",
  violet: "VIOLET",
  lime: "LIME",
} as const satisfies Record<ManagedBlogPost["accent"], ContentAccent>;

const toManagedBlogView = (post: {
  slug: string;
  title: string;
  summary: string;
  body: string;
  category: string;
  readingTime: string | null;
  publishedAt: Date;
  accent: ContentAccent;
  tags: unknown;
  featured: boolean;
  published: boolean;
}): BlogPost => ({
  slug: post.slug,
  body: post.body.trim(),
  href: `/blog/${post.slug}`,
  absoluteHref: absoluteUrl(`/blog/${post.slug}`),
  accent: accentFromDb[post.accent],
  title: post.title,
  summary: post.summary,
  date: post.publishedAt.toISOString(),
  featured: post.featured,
  published: post.published,
  tags: tagsSchema.parse(post.tags),
  category: post.category,
  readingTime: post.readingTime ?? undefined,
});

const readManagedBlogPosts = async () => {
  const posts = await db.managedBlogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
  });

  return posts.map(toManagedBlogView);
};

const readPublicBlogPosts = async () => {
  const [managedPosts, filePosts] = await Promise.all([readManagedBlogPosts(), getBlogPosts()]);

  return mergeBlogPostSources(managedPosts, filePosts);
};

const getPublicBlogPostsCached = unstable_cache(readPublicBlogPosts, ["public-blog-posts"], {
  tags: [cacheTags.blog],
});

export const getPublicBlogPosts = async () => getPublicBlogPostsCached();

export const getPublicBlogPost = async (slug: string) => {
  const posts = await getPublicBlogPosts();
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    throw new Error(`Managed blog post not found for slug: ${slug}`);
  }

  return post;
};

export const listManagedBlogPosts = async (): Promise<ManagedBlogListItem[]> => {
  const posts = await db.managedBlogPost.findMany({
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      category: true,
      published: true,
      featured: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return posts.map((post) => ({
    ...post,
    publishedAt: post.publishedAt.toISOString().slice(0, 10),
    updatedAt: post.updatedAt.toISOString(),
  }));
};

export const getManagedBlogPostById = async (id: string): Promise<ManagedBlogPost | null> => {
  const post = await db.managedBlogPost.findUnique({
    where: { id },
    select: {
      title: true,
      slug: true,
      summary: true,
      body: true,
      category: true,
      readingTime: true,
      publishedAt: true,
      accent: true,
      tags: true,
      featured: true,
      published: true,
    },
  });

  if (!post) {
    return null;
  }

  return managedBlogPostSchema.parse({
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    body: post.body,
    category: post.category,
    readingTime: post.readingTime,
    publishedAt: post.publishedAt.toISOString().slice(0, 10),
    accent: managedBlogAccentSchema.parse(accentFromDb[post.accent]),
    tags: tagsSchema.parse(post.tags),
    featured: post.featured,
    published: post.published,
  });
};

export const managedBlogDbValue = {
  accentToDb,
};
