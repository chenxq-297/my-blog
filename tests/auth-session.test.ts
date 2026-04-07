import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, getSession, headers, redirect } = vi.hoisted(() => ({
  getSession: vi.fn(),
  findUnique: vi.fn(),
  redirect: vi.fn((location: string) => {
    throw new Error(`REDIRECT:${location}`);
  }),
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("next/headers", () => ({
  headers,
}));

vi.mock("next/navigation", () => ({
  redirect,
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession,
    },
  },
}));

vi.mock("@/lib/db", () => ({
  db: {
    adminUser: {
      findUnique,
    },
  },
}));

import { getServerSession, requireAdminSession } from "@/features/auth/server";

describe("auth server helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    headers.mockResolvedValue(new Headers());
  });

  it("returns null when the signed-in user is not an admin", async () => {
    getSession.mockResolvedValue({
      user: {
        id: "user_1",
      },
    });
    findUnique.mockResolvedValue(null);

    await expect(getServerSession()).resolves.toBeNull();
    expect(findUnique).toHaveBeenCalledWith({
      where: { userId: "user_1" },
      select: {
        id: true,
        isOwner: true,
      },
    });
  });

  it("returns the admin session when admin access exists", async () => {
    getSession.mockResolvedValue({
      user: {
        id: "user_1",
        email: "owner@example.com",
        name: "Site Owner",
      },
      session: {
        id: "session_1",
      },
    });
    findUnique.mockResolvedValue({
      id: "admin_1",
      isOwner: true,
    });

    await expect(getServerSession()).resolves.toMatchObject({
      user: {
        id: "user_1",
      },
      adminUser: {
        id: "admin_1",
        isOwner: true,
      },
    });
  });

  it("redirects to the admin login page when no admin session exists", async () => {
    getSession.mockResolvedValue(null);

    await expect(requireAdminSession()).rejects.toThrow("REDIRECT:/admin/login");
    expect(redirect).toHaveBeenCalledWith("/admin/login");
  });

  it("redirects signed-in non-admin users with an explicit authorization error", async () => {
    getSession.mockResolvedValue({
      user: {
        id: "user_2",
      },
    });
    findUnique.mockResolvedValue(null);

    await expect(requireAdminSession()).rejects.toThrow(
      "REDIRECT:/admin/login?error=not-authorized",
    );
    expect(redirect).toHaveBeenCalledWith("/admin/login?error=not-authorized");
  });
});
