import type { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getAllEntries();

  const routes = ["", "/about", "/blog", "/travel", "/notes", "/projects"].map((pathname) => ({
    url: `${siteConfig.url}${pathname}`,
    lastModified: new Date(),
  }));

  return [
    ...routes,
    ...entries.map((entry) => ({
      url: entry.absoluteHref,
      lastModified: new Date(entry.date),
    })),
  ];
}
