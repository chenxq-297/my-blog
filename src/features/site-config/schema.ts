import { z } from "zod";

const navItemSchema = z.object({
  label: z.string().trim().min(1, "Navigation label is required."),
  href: z.string().trim().min(1, "Navigation href is required."),
  sortOrder: z.number().int().nonnegative(),
  isVisible: z.boolean(),
});

const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Social label is required."),
  href: z.string().trim().min(1, "Social href is required."),
  sortOrder: z.number().int().nonnegative(),
  isVisible: z.boolean(),
});

const hasUniqueSortOrder = <T extends { sortOrder: number }>(items: T[]) =>
  new Set(items.map((item) => item.sortOrder)).size === items.length;
const hasUniqueHref = <T extends { href: string }>(items: T[]) =>
  new Set(items.map((item) => item.href)).size === items.length;

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Site name is required."),
  role: z.string().trim().min(1, "Role is required."),
  location: z.string().trim().min(1, "Location is required."),
  title: z.string().trim().min(1, "Title is required."),
  description: z.string().trim().min(1, "Description is required."),
  url: z.url("A valid URL is required."),
  email: z.email("A valid email is required."),
  intro: z.string().trim().min(1, "Intro is required."),
  status: z.string().trim().min(1, "Status is required."),
  locale: z.string().trim().min(2, "Locale is required."),
  navigation: z
    .array(navItemSchema)
    .min(1, "At least one navigation item is required.")
    .refine(hasUniqueSortOrder, {
      message: "Navigation sortOrder values must be unique.",
    })
    .refine(hasUniqueHref, {
      message: "Navigation href values must be unique.",
    }),
  socialLinks: z
    .array(socialLinkSchema)
    .min(1, "At least one social link is required.")
    .refine(hasUniqueSortOrder, {
      message: "Social link sortOrder values must be unique.",
    })
    .refine(hasUniqueHref, {
      message: "Social link href values must be unique.",
    }),
});

export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;
export type SiteSettings = z.output<typeof siteSettingsSchema>;
