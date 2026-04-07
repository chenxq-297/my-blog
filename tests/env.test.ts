import { describe, expect, it } from "vitest";
import { envSchema } from "../src/lib/env";

describe("env schema", () => {
  it("accepts the required backend variables", () => {
    const parsed = envSchema.parse({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/personal_blog_dev",
      BETTER_AUTH_SECRET: "a-secret-at-least-32-characters-long",
      BETTER_AUTH_URL: "http://localhost:3000",
      ADMIN_EMAIL: "owner@example.com",
      ADMIN_PASSWORD: "password1234",
      ADMIN_NAME: "Site Owner",
    });

    expect(parsed.ADMIN_EMAIL).toBe("owner@example.com");
  });
});
