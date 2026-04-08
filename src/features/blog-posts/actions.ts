"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/features/auth/server";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { managedBlogPostSchema } from "./schema";
import { managedBlogDbValue } from "./queries";

const revalidateBlogTag = revalidateTag as unknown as (tag: string, profile?: "max") => void;

const toDbPayload = (input: unknown) => {
  const parsed = managedBlogPostSchema.parse(input);

  return {
    ...parsed,
    readingTime: parsed.readingTime,
    publishedAt: new Date(`${parsed.publishedAt}T00:00:00.000Z`),
    accent: managedBlogDbValue.accentToDb[parsed.accent],
    tags: parsed.tags,
  };
};

const revalidateBlogSurfaces = (slug: string, previousSlug?: string) => {
  revalidateBlogTag(cacheTags.blog, "max");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin/blog");

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
};

export const createManagedBlogPost = async (input: unknown) => {
  await requireAdminSession();

  const payload = toDbPayload(input);
  const post = await db.managedBlogPost.create({
    data: payload,
    select: {
      id: true,
      slug: true,
    },
  });

  revalidateBlogSurfaces(post.slug);
  redirect(`/admin/blog/${post.id}`);
};

export const updateManagedBlogPost = async (id: string, input: unknown) => {
  await requireAdminSession();

  const payload = toDbPayload(input);
  const existing = await db.managedBlogPost.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!existing) {
    throw new Error(`Managed blog post not found for id: ${id}`);
  }

  const post = await db.managedBlogPost.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      slug: true,
    },
  });

  revalidateBlogSurfaces(post.slug, existing.slug);
  redirect(`/admin/blog/${post.id}`);
};
