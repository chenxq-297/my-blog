import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
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
  plugins: [nextCookies()],
});
