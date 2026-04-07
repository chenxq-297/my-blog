import { describe, expect, it } from "vitest";
import { canCreateUser } from "../src/features/auth/registration-guard";

describe("canCreateUser", () => {
  it("allows creating the first user", () => {
    expect(canCreateUser(0)).toBe(true);
  });

  it("blocks sign-up after the first user exists", () => {
    expect(canCreateUser(1)).toBe(false);
    expect(canCreateUser(2)).toBe(false);
  });
});
