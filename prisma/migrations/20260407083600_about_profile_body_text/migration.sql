/*
  Align AboutPage profile body fields with the Phase 1 contract.

  Contract requires singular text fields:
  - profileBody: string
  - profileBodySecondary: string
*/

ALTER TABLE "about_page"
  ALTER COLUMN "profileBody" TYPE TEXT
  USING COALESCE(array_to_string("profileBody", E'\n\n'), '');

ALTER TABLE "about_page"
  ALTER COLUMN "profileBody" SET NOT NULL;

ALTER TABLE "about_page"
  ALTER COLUMN "profileBodySecondary" TYPE TEXT
  USING COALESCE(array_to_string("profileBodySecondary", E'\n\n'), '');

ALTER TABLE "about_page"
  ALTER COLUMN "profileBodySecondary" SET NOT NULL;
