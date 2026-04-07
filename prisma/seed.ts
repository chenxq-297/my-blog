import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import {
  defaultNavItems,
  defaultSiteSettings,
  defaultSocialLinks,
} from "../src/features/site-config/defaults";
import { defaultHomeSections } from "../src/features/home-sections/defaults";
import { defaultAboutPage } from "../src/features/about/defaults";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run the Prisma seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SITE_SETTINGS_ID = "site_settings_default";
const ABOUT_PAGE_ID = "about_page_default";

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: SITE_SETTINGS_ID },
      update: {
        ...defaultSiteSettings,
      },
      create: {
        id: SITE_SETTINGS_ID,
        ...defaultSiteSettings,
      },
    });

    await tx.navItem.deleteMany({ where: { siteSettingsId: SITE_SETTINGS_ID } });
    await tx.navItem.createMany({
      data: defaultNavItems.map((item) => ({
        siteSettingsId: SITE_SETTINGS_ID,
        href: item.href,
        label: item.label,
        isVisible: item.isVisible,
        sortOrder: item.sortOrder,
      })),
    });

    await tx.socialLink.deleteMany({ where: { siteSettingsId: SITE_SETTINGS_ID } });
    await tx.socialLink.createMany({
      data: defaultSocialLinks.map((item) => ({
        siteSettingsId: SITE_SETTINGS_ID,
        href: item.href,
        label: item.label,
        isVisible: item.isVisible,
        sortOrder: item.sortOrder,
      })),
    });

    await tx.homeSectionItem.deleteMany();
    await tx.homeSection.deleteMany();

    for (const section of defaultHomeSections) {
      const createdSection = await tx.homeSection.create({
        data: {
          key: section.key,
          eyebrow: section.eyebrow ?? null,
          title: section.title,
          description: section.description ?? null,
          isVisible: section.isVisible,
          sortOrder: section.sortOrder,
          sourceCollection: section.sourceCollection ?? null,
          maxItems: section.maxItems ?? null,
        },
      });

      if (section.items.length > 0) {
        await tx.homeSectionItem.createMany({
          data: section.items.map((item) => {
            if (item.kind === "HERO_STAT") {
              return {
                homeSectionId: createdSection.id,
                sortOrder: item.sortOrder,
                kind: item.kind,
                label: item.label,
                value: item.value,
              };
            }

            if (item.kind === "PINNED_ENTRY") {
              return {
                homeSectionId: createdSection.id,
                sortOrder: item.sortOrder,
                kind: item.kind,
                contentCollection: item.contentCollection,
                slug: item.slug,
              };
            }

            return {
              homeSectionId: createdSection.id,
              sortOrder: item.sortOrder,
              kind: item.kind,
              label: item.label,
              href: item.href,
            };
          }),
        });
      }
    }

    await tx.aboutPage.upsert({
      where: { id: ABOUT_PAGE_ID },
      update: {
        ...defaultAboutPage,
      },
      create: {
        id: ABOUT_PAGE_ID,
        ...defaultAboutPage,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
