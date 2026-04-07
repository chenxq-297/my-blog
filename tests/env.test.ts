import fs from "fs";
import path from "path";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { envSchema, getEnv, resetEnv } from "../src/lib/env";

const requiredEnvKeys = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME",
];

const envFixture: Record<string, string> = {
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/personal_blog_dev",
  BETTER_AUTH_SECRET: "a-secret-at-least-32-characters-long",
  BETTER_AUTH_URL: "http://localhost:3000",
  ADMIN_EMAIL: "owner@example.com",
  ADMIN_PASSWORD: "password1234",
  ADMIN_NAME: "Site Owner",
};

const envFilePath = path.resolve(".env.local");
const baselineEnv = captureEnv();
let envLocalBackup: { exists: boolean; contents?: string } | null = null;

function captureEnv(): Record<string, string | undefined> {
  return requiredEnvKeys.reduce<Record<string, string | undefined>>((acc, key) => {
    acc[key] = process.env[key];
    return acc;
  }, {});
}

function restoreEnv(snapshot: Record<string, string | undefined>) {
  requiredEnvKeys.forEach((key) => {
    const value = snapshot[key];
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
}

function clearRequiredEnvKeys() {
  requiredEnvKeys.forEach((key) => {
    delete process.env[key];
  });
}

function writeEnvFile(values: Record<string, string>) {
  const contents = Object.entries(values)
    .map(([key, value]) => `${key}="${value}"`)
    .join("\n");

  fs.writeFileSync(envFilePath, contents, "utf8");
}

async function removeEnvFile() {
  if (fs.existsSync(envFilePath)) {
    await fs.promises.unlink(envFilePath);
  }
}

beforeAll(() => {
  const exists = fs.existsSync(envFilePath);
  envLocalBackup = { exists };
  if (exists) {
    envLocalBackup.contents = fs.readFileSync(envFilePath, "utf8");
  }
});

afterEach(async () => {
  restoreEnv(baselineEnv);
  resetEnv();
  await removeEnvFile();
});

afterAll(async () => {
  if (!envLocalBackup) return;

  if (envLocalBackup.exists) {
    fs.writeFileSync(envFilePath, envLocalBackup.contents ?? "", "utf8");
  } else {
    await removeEnvFile();
  }
});

describe("env schema", () => {
  it("accepts the required backend variables", () => {
    const parsed = envSchema.parse(envFixture);
    expect(parsed.ADMIN_EMAIL).toBe("owner@example.com");
  });
});

describe("getEnv()", () => {
  it("reads from process.env when the variables are set", () => {
    restoreEnv(baselineEnv);
    Object.entries(envFixture).forEach(([key, value]) => {
      process.env[key] = value;
    });

    resetEnv();
    const parsed = getEnv();

    expect(parsed.ADMIN_NAME).toBe("Site Owner");
  });

  it("throws when a required environment variable is missing", () => {
    clearRequiredEnvKeys();
    resetEnv();

    expect(() => getEnv()).toThrow();
  });

  it("loads variables from .env.local when present", () => {
    clearRequiredEnvKeys();
    writeEnvFile(envFixture);
    resetEnv();

    const parsed = getEnv();

    expect(parsed.DATABASE_URL).toBe(envFixture.DATABASE_URL);
  });
});
