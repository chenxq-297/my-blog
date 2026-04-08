import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { defaultAboutPage } from "./defaults";
import { aboutPageSchema } from "./schema";

const readAboutPage = async () => {
  const aboutPage = await db.aboutPage.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!aboutPage) {
    return aboutPageSchema.parse(defaultAboutPage);
  }

  return aboutPageSchema.parse({
    eyebrow: aboutPage.eyebrow,
    title: aboutPage.title,
    description: aboutPage.description,
    profileHeading: aboutPage.profileHeading,
    profileBody: aboutPage.profileBody,
    profileBodySecondary: aboutPage.profileBodySecondary,
    focusHeading: aboutPage.focusHeading,
    focusBody: aboutPage.focusBody,
    principlesHeading: aboutPage.principlesHeading,
    principles: aboutPage.principles,
  });
};

const getAboutPageCached = unstable_cache(readAboutPage, ["about-page"], {
  tags: [cacheTags.about],
});

export const getAboutPage = async () => getAboutPageCached();
