import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { defaultNavItems, defaultSiteSettings, defaultSocialLinks } from "./defaults";
import { siteSettingsSchema } from "./schema";

const readSiteSettings = async () => {
  const siteSettings = await db.siteSettings.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!siteSettings) {
    return siteSettingsSchema.parse({
      ...defaultSiteSettings,
      navigation: defaultNavItems,
      socialLinks: defaultSocialLinks,
    });
  }

  const [navigation, socialLinks] = await Promise.all([
    db.navItem.findMany({
      where: {
        siteSettingsId: siteSettings.id,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        href: true,
        label: true,
        isVisible: true,
        sortOrder: true,
      },
    }),
    db.socialLink.findMany({
      where: {
        siteSettingsId: siteSettings.id,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        href: true,
        label: true,
        isVisible: true,
        sortOrder: true,
      },
    }),
  ]);

  return siteSettingsSchema.parse({
    siteName: siteSettings.siteName,
    role: siteSettings.role,
    location: siteSettings.location,
    title: siteSettings.title,
    description: siteSettings.description,
    url: siteSettings.url,
    email: siteSettings.email,
    intro: siteSettings.intro,
    status: siteSettings.status,
    locale: siteSettings.locale,
    navigation: navigation.length > 0 ? navigation : defaultNavItems,
    socialLinks: socialLinks.length > 0 ? socialLinks : defaultSocialLinks,
  });
};

const getSiteSettingsCached = unstable_cache(readSiteSettings, ["site-settings"], {
  tags: [cacheTags.site],
});

export const getSiteSettings = async () => getSiteSettingsCached();

