import { describe, expect, it } from "vitest";
import { canCreateUser } from "@/features/auth/creation-guard";

const secret = "a-secret-at-least-32-characters-long";

describe("canCreateUser", () => {
  it("blocks public first-user signup without the trusted bootstrap header", () => {
    expect(
      canCreateUser({
        bootstrapSecret: secret,
        configuredEmail: "owner@example.com",
        existingUserCount: 0,
        requestEmail: "owner@example.com",
        requestHeader: null,
      }),
    ).toBe(false);
  });

  it("blocks bootstrap attempts for a non-owner email", () => {
    expect(
      canCreateUser({
        bootstrapSecret: secret,
        configuredEmail: "owner@example.com",
        existingUserCount: 0,
        requestEmail: "intruder@example.com",
        requestHeader: secret,
      }),
    ).toBe(false);
  });

  it("allows the trusted bootstrap request for the configured owner email", () => {
    expect(
      canCreateUser({
        bootstrapSecret: secret,
        configuredEmail: " owner@example.com ",
        existingUserCount: 0,
        requestEmail: "Owner@Example.com",
        requestHeader: secret,
      }),
    ).toBe(true);
  });

  it("blocks all later signups after the first account exists", () => {
    expect(
      canCreateUser({
        bootstrapSecret: secret,
        configuredEmail: "owner@example.com",
        existingUserCount: 1,
        requestEmail: "owner@example.com",
        requestHeader: secret,
      }),
    ).toBe(false);
  });
});
