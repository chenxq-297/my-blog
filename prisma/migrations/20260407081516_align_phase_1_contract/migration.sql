/*
  Phase 1 contract alignment.

  This migration is intentionally written by hand because `prisma migrate dev`
  cannot execute the generated steps non-interactively when existing seed data
  is present.
*/

-- Site settings: `name` -> `siteName`
ALTER TABLE "site_settings" RENAME COLUMN "name" TO "siteName";

-- Ordered items: `order` -> `sortOrder`, plus `isVisible`
ALTER TABLE "nav_items" RENAME COLUMN "order" TO "sortOrder";
ALTER TABLE "nav_items" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE "social_links" RENAME COLUMN "order" TO "sortOrder";
ALTER TABLE "social_links" ADD COLUMN "isVisible" BOOLEAN NOT NULL DEFAULT TRUE;

-- Home sections: `isEnabled` -> `isVisible`, `order` -> `sortOrder`, make `maxItems` nullable
ALTER TABLE "home_sections" RENAME COLUMN "isEnabled" TO "isVisible";
ALTER TABLE "home_sections" RENAME COLUMN "order" TO "sortOrder";
ALTER TABLE "home_sections" ALTER COLUMN "maxItems" DROP NOT NULL;
ALTER TABLE "home_sections" ALTER COLUMN "maxItems" DROP DEFAULT;
ALTER TABLE "home_sections" ALTER COLUMN "sourceCollection" DROP NOT NULL;

-- Home section items: `order` -> `sortOrder`
ALTER TABLE "home_section_items" RENAME COLUMN "order" TO "sortOrder";

-- About page: add secondary profile body, and store principles as JSON
ALTER TABLE "about_page"
  ADD COLUMN "profileBodySecondary" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "about_page" RENAME COLUMN "principles" TO "principles_old";
ALTER TABLE "about_page"
  ADD COLUMN "principles" JSONB NOT NULL DEFAULT '[]'::JSONB;
UPDATE "about_page"
  SET "principles" = COALESCE(to_jsonb("principles_old"), '[]'::JSONB);
ALTER TABLE "about_page" DROP COLUMN "principles_old";
ALTER TABLE "about_page" ALTER COLUMN "principles" DROP DEFAULT;

-- Enum contract alignment.
-- HomeSectionKey: FROM_THE_ROAD -> TRAVEL
ALTER TYPE "HomeSectionKey" RENAME TO "HomeSectionKey_old";
CREATE TYPE "HomeSectionKey" AS ENUM ('HERO', 'LATEST_WRITING', 'TRAVEL', 'SELECTED_WORK');
ALTER TABLE "home_sections"
  ALTER COLUMN "key" TYPE "HomeSectionKey"
  USING (
    CASE
      WHEN "key"::TEXT = 'FROM_THE_ROAD' THEN 'TRAVEL'
      ELSE "key"::TEXT
    END
  )::"HomeSectionKey";
DROP TYPE "HomeSectionKey_old";

-- HomeSectionSourceCollection: contract values only, nullable for HERO
ALTER TYPE "HomeSectionSourceCollection" RENAME TO "HomeSectionSourceCollection_old";
CREATE TYPE "HomeSectionSourceCollection" AS ENUM ('BLOG_AND_NOTES', 'TRAVEL', 'PROJECTS');
ALTER TABLE "home_sections"
  ALTER COLUMN "sourceCollection" TYPE "HomeSectionSourceCollection"
  USING (
    CASE
      WHEN "sourceCollection" IS NULL THEN NULL
      WHEN "sourceCollection"::TEXT = 'NONE' THEN NULL
      WHEN "sourceCollection"::TEXT = 'MIXED' THEN 'BLOG_AND_NOTES'
      WHEN "sourceCollection"::TEXT = 'BLOG' THEN 'BLOG_AND_NOTES'
      WHEN "sourceCollection"::TEXT = 'NOTES' THEN 'BLOG_AND_NOTES'
      WHEN "sourceCollection"::TEXT = 'TRAVEL' THEN 'TRAVEL'
      WHEN "sourceCollection"::TEXT = 'PROJECTS' THEN 'PROJECTS'
      ELSE NULL
    END
  )::"HomeSectionSourceCollection";
DROP TYPE "HomeSectionSourceCollection_old";

-- HomeSectionItemKind: STAT -> HERO_STAT
ALTER TYPE "HomeSectionItemKind" RENAME TO "HomeSectionItemKind_old";
CREATE TYPE "HomeSectionItemKind" AS ENUM ('HERO_STAT', 'PINNED_ENTRY', 'LINK');
ALTER TABLE "home_section_items"
  ALTER COLUMN "kind" TYPE "HomeSectionItemKind"
  USING (
    CASE
      WHEN "kind"::TEXT = 'STAT' THEN 'HERO_STAT'
      ELSE "kind"::TEXT
    END
  )::"HomeSectionItemKind";
DROP TYPE "HomeSectionItemKind_old";

-- Follow-ups: keep schema tidy and index names consistent with the contract.
ALTER TABLE "about_page" ALTER COLUMN "profileBodySecondary" DROP DEFAULT;

ALTER INDEX "home_section_items_homeSectionId_order_key" RENAME TO "home_section_items_homeSectionId_sortOrder_key";
ALTER INDEX "nav_items_siteSettingsId_order_key" RENAME TO "nav_items_siteSettingsId_sortOrder_key";
ALTER INDEX "social_links_siteSettingsId_order_key" RENAME TO "social_links_siteSettingsId_sortOrder_key";
