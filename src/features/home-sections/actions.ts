"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSession } from "@/features/auth/server";
import { cacheTags } from "@/lib/cache";
import { db } from "@/lib/db";
import { homeSectionsSchema } from "./schema";

const revalidateHomeTag = revalidateTag as unknown as (tag: string) => void;

export const updateHomeSections = async (input: unknown) => {
  await requireAdminSession();

  const parsedSections = homeSectionsSchema.parse(input);

  await db.$transaction(async (tx) => {
    for (const section of parsedSections) {
      const { key, ...data } = section;
      const existing = await tx.homeSection.findUnique({
        where: { key },
        select: { id: true },
      });

      if (existing) {
        await tx.homeSection.update({
          where: { id: existing.id },
          data,
        });
      } else {
        await tx.homeSection.create({
          data: {
            key,
            ...data,
          },
        });
      }
    }
  });

  revalidateHomeTag(cacheTags.home);
  revalidatePath("/");
};
