import { config } from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { z } from "zod";

const localEnvPath = path.resolve(".env.local");
const defaultEnvPath = path.resolve(".env");
let dotenvLoaded = false;

const loadDotenv = () => {
  if (dotenvLoaded) return;
  dotenvLoaded = true;

  const loadFile = (filePath: string) => {
    if (existsSync(filePath)) {
      config({ path: filePath, override: false });
      return true;
    }
    return false;
  };

  if (loadFile(localEnvPath)) {
    return;
  }

  loadFile(defaultEnvPath);
};

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_NAME: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | undefined;

export const getEnv = (): Env => {
  loadDotenv();
  if (cachedEnv) return cachedEnv;

  cachedEnv = envSchema.parse({
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_NAME: process.env.ADMIN_NAME,
  });

  return cachedEnv;
};

export const resetEnv = () => {
  cachedEnv = undefined;
  dotenvLoaded = false;
};
