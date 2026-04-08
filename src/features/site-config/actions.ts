"use server";

import { revalidateTag } from "next/cache";
import { requireAdminSession } from "@/features/auth/server";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { siteSettingsSchema } from "./schema";

const revalidateSiteTag = revalidateTag as unknown as (tag: string) => void;

export const updateSiteSettings = async (input: unknown) => {
  await requireAdminSession();

  const parsed = siteSettingsSchema.parse(input);
  const { navigation, socialLinks, ...siteSettingsData } = parsed;

  await db.$transaction(async (tx) => {
    const existing = await tx.siteSettings.findFirst({
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    const siteSettings = existing
      ? await tx.siteSettings.update({
          where: { id: existing.id },
          data: siteSettingsData,
          select: { id: true },
        })
      : await tx.siteSettings.create({
          data: siteSettingsData,
          select: { id: true },
        });

    await tx.navItem.deleteMany({
      where: { siteSettingsId: siteSettings.id },
    });

    if (navigation.length > 0) {
      await tx.navItem.createMany({
        data: navigation.map((item) => ({
          siteSettingsId: siteSettings.id,
          href: item.href,
          label: item.label,
          isVisible: item.isVisible,
          sortOrder: item.sortOrder,
        })),
      });
    }

    await tx.socialLink.deleteMany({
      where: { siteSettingsId: siteSettings.id },
    });

    if (socialLinks.length > 0) {
      await tx.socialLink.createMany({
        data: socialLinks.map((item) => ({
          siteSettingsId: siteSettings.id,
          href: item.href,
          label: item.label,
          isVisible: item.isVisible,
          sortOrder: item.sortOrder,
        })),
      });
    }
  });

  revalidateSiteTag(cacheTags.site);
};
