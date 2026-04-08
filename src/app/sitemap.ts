import type { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/features/blog-posts/queries";
import { getSiteSettings } from "@/features/site-config/queries";
import { getNoteEntries, getProjectEntries, getTravelEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteSettings, blogPosts, noteEntries, projectEntries, travelEntries] = await Promise.all([
    getSiteSettings(),
    getPublicBlogPosts(),
    getNoteEntries(),
    getProjectEntries(),
    getTravelEntries(),
  ]);
  const entries = [...blogPosts, ...noteEntries, ...projectEntries, ...travelEntries];

  const routes = ["", "/about", "/blog", "/travel", "/notes", "/projects"].map((pathname) => ({
    url: `${siteSettings.url}${pathname}`,
    lastModified: new Date(),
  }));

  return [
    ...routes,
    ...entries.map((entry) => ({
      url: absoluteUrl(entry.href, siteSettings.url),
      lastModified: new Date(entry.date),
    })),
  ];
}
