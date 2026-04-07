import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export type AdminSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> & {
  adminUser: {
    id: string;
    isOwner: boolean;
  };
};

export const getSession = async () => {
  const requestHeaders = await headers();

  return auth.api.getSession({
    headers: new Headers(requestHeaders),
  });
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const adminUser = await db.adminUser.findUnique({
    where: { userId: session.user.id },
    select: {
      id: true,
      isOwner: true,
    },
  });

  if (!adminUser) {
    return null;
  }

  return {
    ...session,
    adminUser,
  };
};

export const requireAdminSession = async () => {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
};
