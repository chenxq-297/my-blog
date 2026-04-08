import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/features/site-config/queries";
import { getAllEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [siteSettings, entries] = await Promise.all([getSiteSettings(), getAllEntries()]);

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
