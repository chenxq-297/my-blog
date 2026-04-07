import { normalizeEmail } from "@/features/auth/creation-guard";

type OwnerBootstrapEnv = {
  ADMIN_EMAIL: string;
  ADMIN_NAME: string;
  ADMIN_PASSWORD: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
};

type OwnerBootstrapDeps = {
  auth: {
    api: {
      signUpEmail: (input: {
        body: {
          email: string;
          name: string;
          password: string;
        };
        headers: Headers;
      }) => Promise<{
        user: {
          id: string;
        };
      }>;
    };
  };
  db: {
    adminUser: {
      findMany: (args: {
        select: {
          user: {
            select: {
              email: true;
            };
          };
        };
      }) => Promise<
        Array<{
        user: {
          email: string;
        };
      }>
      >;
      upsert: (args: {
        where: { userId: string };
        update: { isOwner: true };
        create: { userId: string; isOwner: true };
      }) => Promise<unknown>;
    };
    user: {
      count: () => Promise<number>;
      findFirst: (args: {
        where: {
          email: {
            equals: string;
            mode: "insensitive";
          };
        };
        select: { id: true };
      }) => Promise<{ id: string } | null>;
      update: (args: {
        where: { id: string };
        data: { name: string };
      }) => Promise<unknown>;
    };
  };
  env: OwnerBootstrapEnv;
};

const getOwnerDriftError = (configuredEmail: string, existingOwnerEmail: string) =>
  [
    `Configured ADMIN_EMAIL "${configuredEmail}" does not match the existing owner "${existingOwnerEmail}".`,
    "Update ADMIN_EMAIL to match the seeded owner or reset the auth data before running db:seed again.",
  ].join(" ");

const getRegistrationLockedError = (configuredEmail: string, userCount: number) =>
  [
    `Cannot bootstrap owner "${configuredEmail}" because registration is locked and ${userCount} user(s) already exist.`,
    "Re-use the existing owner account or reset the auth data before running db:seed again.",
  ].join(" ");

export const ensureOwnerAccount = async ({ auth, db, env }: OwnerBootstrapDeps) => {
  const configuredEmail = normalizeEmail(env.ADMIN_EMAIL);
  const existingAdminUsers = await db.adminUser.findMany({
    select: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const driftedOwner = existingAdminUsers.find(
    (adminUser) => normalizeEmail(adminUser.user.email) !== configuredEmail,
  );

  if (driftedOwner) {
    throw new Error(getOwnerDriftError(env.ADMIN_EMAIL, driftedOwner.user.email));
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: {
        equals: configuredEmail,
        mode: "insensitive",
      },
    },
    select: { id: true },
  });

  if (!existingUser) {
    const userCount = await db.user.count();

    if (userCount > 0) {
      throw new Error(getRegistrationLockedError(env.ADMIN_EMAIL, userCount));
    }
  }

  const userId =
    existingUser?.id ??
    (
      await auth.api.signUpEmail({
        body: {
          name: env.ADMIN_NAME,
          email: configuredEmail,
          password: env.ADMIN_PASSWORD,
        },
        headers: new Headers({
          origin: new URL(env.BETTER_AUTH_URL).origin,
          host: new URL(env.BETTER_AUTH_URL).host,
          "x-seed-bootstrap": env.BETTER_AUTH_SECRET,
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

  return userId;
};
