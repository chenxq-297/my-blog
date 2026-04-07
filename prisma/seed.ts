import {
  defaultNavItems,
  defaultSiteSettings,
  defaultSocialLinks,
} from "../src/features/site-config/defaults";
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

const ensureOwnerAccount = async () => {
  const env = getEnv();
  const existingUser = await db.user.findUnique({
    where: { email: env.ADMIN_EMAIL },
    select: { id: true },
  });

  const userId =
    existingUser?.id ??
    (
      await auth.api.signUpEmail({
        body: {
          name: env.ADMIN_NAME,
          email: env.ADMIN_EMAIL,
          password: env.ADMIN_PASSWORD,
        },
        headers: new Headers({
          origin: new URL(env.BETTER_AUTH_URL).origin,
          host: new URL(env.BETTER_AUTH_URL).host,
        }),
      })
    ).user.id;

  await db.user.update({
    where: { id: userId },
    data: { name: env.ADMIN_NAME },
  });

  await db.adminUser.upsert({
    where: { userId },
    update: { isOwner: true },
    create: {
      userId,
      isOwner: true,
    },
  });
};

async function main() {
  await seedContent();
  await ensureOwnerAccount();
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
