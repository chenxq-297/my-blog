import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { canCreateUser } from "@/features/auth/creation-guard";
import { db } from "@/lib/db";
import { getEnv } from "@/lib/env";

const env = getEnv();

const getTrustedOrigins = () => {
  const configuredOrigin = new URL(env.BETTER_AUTH_URL).origin;
  const alternateOrigin = configuredOrigin.includes("localhost")
    ? configuredOrigin.replace("localhost", "127.0.0.1")
    : configuredOrigin.replace("127.0.0.1", "localhost");

  return Array.from(new Set([configuredOrigin, alternateOrigin]));
};

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: new URL(env.BETTER_AUTH_URL).origin,
  basePath: "/api/auth",
  trustedOrigins: getTrustedOrigins(),
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, context) => {
          const userCount = await db.user.count();

          if (
            !canCreateUser({
              bootstrapSecret: env.BETTER_AUTH_SECRET,
              configuredEmail: env.ADMIN_EMAIL,
              existingUserCount: userCount,
              requestEmail: user.email,
              requestHeader: context?.headers?.get("x-seed-bootstrap") ?? null,
            })
          ) {
            return false;
          }

          return { data: user };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
