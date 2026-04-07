import { config } from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { defineConfig, env } from "prisma/config";

const localEnvPath = path.resolve(".env.local");
const defaultEnvPath = path.resolve(".env");

const loadEnvFile = () => {
  if (existsSync(localEnvPath)) {
    config({ path: localEnvPath, override: false });
    return;
  }

  if (existsSync(defaultEnvPath)) {
    config({ path: defaultEnvPath, override: false });
  }
};

loadEnvFile();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
