import { z } from "zod";

export const homeSectionKeySchema = z.enum([
  "HERO",
  "LATEST_WRITING",
  "TRAVEL",
  "SELECTED_WORK",
]);

export const homeSectionSourceCollectionSchema = z.enum([
  "BLOG_AND_NOTES",
  "TRAVEL",
  "PROJECTS",
]);

export const homeSectionItemSchema = z.object({
  kind: z.enum(["HERO_STAT", "PINNED_ENTRY", "LINK"]),
  sortOrder: z.number().int().nonnegative(),
  label: z.string().trim().min(1).nullable().optional(),
  value: z.string().trim().min(1).nullable().optional(),
  href: z.string().trim().min(1).nullable().optional(),
  contentCollection: z.enum(["BLOG", "TRAVEL", "NOTES", "PROJECTS"]).nullable().optional(),
  slug: z.string().trim().min(1).nullable().optional(),
});

export const homeSectionSchema = z.object({
  key: homeSectionKeySchema,
  eyebrow: z.string().trim().min(1).nullable(),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1).nullable(),
  isVisible: z.boolean(),
  sortOrder: z.number().int().nonnegative(),
  sourceCollection: homeSectionSourceCollectionSchema.nullable(),
  maxItems: z.number().int().positive().nullable(),
});

export const homeSectionWithItemsSchema = homeSectionSchema.extend({
  items: z.array(homeSectionItemSchema),
});

export const homeSectionsSchema = z.array(homeSectionSchema);

export type HomeSectionKey = z.output<typeof homeSectionKeySchema>;
export type HomeSection = z.output<typeof homeSectionSchema>;
export type HomeSectionWithItems = z.output<typeof homeSectionWithItemsSchema>;
