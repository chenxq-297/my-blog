import { config } from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { defineConfig } from "prisma/config";

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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for Prisma config.");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
