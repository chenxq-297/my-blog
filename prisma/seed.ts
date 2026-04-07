import {
  defaultNavItems,
  defaultSiteSettings,
  defaultSocialLinks,
} from "../src/features/site-config/defaults";
import { ensureOwnerAccount } from "../src/features/auth/owner-bootstrap";
import { defaultHomeSections } from "../src/features/home-sections/defaults";
import { defaultAboutPage } from "../src/features/about/defaults";
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { getEnv } from "../src/lib/env";

const SITE_SETTINGS_ID = "site_settings_default";
const ABOUT_PAGE_ID = "about_page_default";

const seedContent = async () => {
  await db.$transaction(async (tx) => {
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
};

const bootstrapOwnerAccount = async () => {
  const env = getEnv();
  await ensureOwnerAccount({
    auth,
    db,
    env,
  });
};

async function main() {
  await bootstrapOwnerAccount();
  await seedContent();
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    process.exit(1);
  });
