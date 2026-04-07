import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

type AdminSession = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>> & {
  adminUser: {
    id: string;
    isOwner: boolean;
  };
};

type AdminMembership = AdminSession["adminUser"];

const readSession = async () => {
  const requestHeaders = await headers();

  return auth.api.getSession({
    headers: new Headers(requestHeaders),
  });
};

const readAdminMembership = async (userId: string): Promise<AdminMembership | null> =>
  db.adminUser.findUnique({
    where: { userId },
    select: {
      id: true,
      isOwner: true,
    },
  });

export const getServerSession = async (): Promise<AdminSession | null> => {
  const session = await readSession();

  if (!session) {
    return null;
  }

  const adminUser = await readAdminMembership(session.user.id);

  if (!adminUser) {
    return null;
  }

  return {
    ...session,
    adminUser,
  };
};

export const requireAdminSession = async () => {
  const session = await readSession();

  if (!session) {
    redirect("/admin/login");
  }

  const adminUser = await readAdminMembership(session.user.id);

  if (!adminUser) {
    redirect("/admin/login?error=not-authorized");
  }

  return {
    ...session,
    adminUser,
  };
};
