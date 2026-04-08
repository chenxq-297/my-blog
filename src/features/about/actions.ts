"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/features/auth/server";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { aboutPageSchema } from "./schema";

const revalidateAboutTag = revalidateTag as unknown as (tag: string, profile?: "max") => void;

export const updateAboutPage = async (input: unknown) => {
  await requireAdminSession();

  const parsed = aboutPageSchema.parse(input);
  const existing = await db.aboutPage.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (existing) {
    await db.aboutPage.update({
      where: { id: existing.id },
      data: parsed,
    });
  } else {
    await db.aboutPage.create({
      data: parsed,
    });
  }

  revalidateAboutTag(cacheTags.about, "max");
  revalidatePath("/about");
};
