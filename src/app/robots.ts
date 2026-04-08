import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/features/site-config/queries";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteSettings = await getSiteSettings();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteSettings.url}/sitemap.xml`,
  };
}
