import { z } from "zod";

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required.`);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const managedBlogAccentSchema = z.enum(["cyan", "violet", "lime"]);

export const managedBlogPostSchema = z.object({
  title: requiredText("Title"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(slugPattern, "Slug must use lowercase letters, numbers, and hyphens only."),
  summary: requiredText("Summary"),
  body: requiredText("Body"),
  category: requiredText("Category"),
  readingTime: z.string().trim().nullable().transform((value) => value || null),
  publishedAt: z
    .string()
    .trim()
    .refine((value) => !Number.isNaN(Date.parse(value)), "Publish date must be a valid date."),
  accent: managedBlogAccentSchema,
  tags: z.array(z.string().trim().min(1)).default([]),
  featured: z.boolean(),
  published: z.boolean(),
});

export const emptyManagedBlogPost = {
  title: "",
  slug: "",
  summary: "",
  body: "",
  category: "Engineering",
  readingTime: "5 min",
  publishedAt: new Date().toISOString().slice(0, 10),
  accent: "cyan",
  tags: [] as string[],
  featured: false,
  published: true,
} satisfies z.input<typeof managedBlogPostSchema>;

export type ManagedBlogPostInput = z.input<typeof managedBlogPostSchema>;
export type ManagedBlogPost = z.output<typeof managedBlogPostSchema>;
