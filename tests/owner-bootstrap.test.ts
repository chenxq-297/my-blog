import { beforeEach, describe, expect, it, vi } from "vitest";
import { ensureOwnerAccount } from "@/features/auth/owner-bootstrap";

  const env = {
  ADMIN_EMAIL: "owner@example.com",
  ADMIN_NAME: "Site Owner",
  ADMIN_PASSWORD: "password1234",
  BETTER_AUTH_URL: "http://localhost:3000",
  BETTER_AUTH_SECRET: "a-secret-at-least-32-characters-long",
};

  const createDeps = () => {
  const findFirst = vi.fn();
  const count = vi.fn();
  const update = vi.fn();
  const findMany = vi.fn();
  const upsert = vi.fn();
  const signUpEmail = vi.fn();

  return {
    deps: {
      auth: {
        api: {
          signUpEmail,
        },
      },
      db: {
        adminUser: {
          findMany,
          upsert,
        },
        user: {
          count,
          findFirst,
          update,
        },
      },
      env,
    },
    mocks: {
      count,
      findMany,
      findFirst,
      signUpEmail,
      update,
      upsert,
    },
  };
};

describe("ensureOwnerAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reuses the configured owner and refreshes admin access", async () => {
    const { deps, mocks } = createDeps();

    mocks.findMany.mockResolvedValue([
      {
        user: {
          email: env.ADMIN_EMAIL,
        },
      },
    ]);
    mocks.findFirst.mockResolvedValue({ id: "user_1" });
    mocks.update.mockResolvedValue(undefined);
    mocks.upsert.mockResolvedValue(undefined);

    await ensureOwnerAccount(deps);

    expect(mocks.signUpEmail).not.toHaveBeenCalled();
    expect(mocks.upsert).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      update: { isOwner: true },
      create: {
        userId: "user_1",
        isOwner: true,
      },
    });
  });

  it("fails fast when the configured owner email drifts from the existing admin owner", async () => {
    const { deps, mocks } = createDeps();

    mocks.findMany.mockResolvedValue([
      {
        user: {
          email: "legacy-owner@example.com",
        },
      },
    ]);

    await expect(ensureOwnerAccount(deps)).rejects.toThrow(
      /does not match the existing owner/i,
    );
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
  });

  it("fails fast when registration is locked and the configured owner is missing", async () => {
    const { deps, mocks } = createDeps();

    mocks.findMany.mockResolvedValue([]);
    mocks.findFirst.mockResolvedValue(null);
    mocks.count.mockResolvedValue(1);

    await expect(ensureOwnerAccount(deps)).rejects.toThrow(/registration is locked/i);
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
  });

  it("reuses a matching configured user and restores owner access when the admin row is missing", async () => {
    const { deps, mocks } = createDeps();

    mocks.findMany.mockResolvedValue([]);
    mocks.findFirst.mockResolvedValue({ id: "user_existing" });
    mocks.update.mockResolvedValue(undefined);
    mocks.upsert.mockResolvedValue(undefined);

    await ensureOwnerAccount(deps);

    expect(mocks.signUpEmail).not.toHaveBeenCalled();
    expect(mocks.upsert).toHaveBeenCalledWith({
      where: { userId: "user_existing" },
      update: { isOwner: true },
      create: {
        userId: "user_existing",
        isOwner: true,
      },
    });
  });

  it("creates the configured owner through Better Auth when the database is empty", async () => {
    const { deps, mocks } = createDeps();

    mocks.findMany.mockResolvedValue([]);
    mocks.findFirst.mockResolvedValue(null);
    mocks.count.mockResolvedValue(0);
    mocks.signUpEmail.mockResolvedValue({
      user: {
        id: "user_new",
      },
    });
    mocks.update.mockResolvedValue(undefined);
    mocks.upsert.mockResolvedValue(undefined);

    await ensureOwnerAccount(deps);

    expect(mocks.signUpEmail).toHaveBeenCalledWith({
      body: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        password: env.ADMIN_PASSWORD,
      },
      headers: expect.objectContaining({
        get: expect.any(Function),
      }),
    });
    const signUpHeaders = mocks.signUpEmail.mock.calls[0]?.[0]?.headers as Headers;
    expect(signUpHeaders.get("x-seed-bootstrap")).toBe(env.BETTER_AUTH_SECRET);
    expect(mocks.upsert).toHaveBeenCalledWith({
      where: { userId: "user_new" },
      update: { isOwner: true },
      create: {
        userId: "user_new",
        isOwner: true,
      },
    });
  });

  it("normalizes the configured email before lookup and drift checks", async () => {
    const { deps, mocks } = createDeps();

    deps.env = {
      ...env,
      ADMIN_EMAIL: " Owner@Example.com ",
    };
    mocks.findMany.mockResolvedValue([
      {
        user: {
          email: "Owner@Example.com",
        },
      },
    ]);
    mocks.findFirst.mockResolvedValue({ id: "user_1" });
    mocks.update.mockResolvedValue(undefined);
    mocks.upsert.mockResolvedValue(undefined);

    await ensureOwnerAccount(deps);

    expect(mocks.findFirst).toHaveBeenCalledWith({
      where: {
        email: {
          equals: "owner@example.com",
          mode: "insensitive",
        },
      },
      select: { id: true },
    });
    expect(mocks.signUpEmail).not.toHaveBeenCalled();
  });
});
