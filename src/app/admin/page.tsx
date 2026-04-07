import { requireAdminSession } from "@/features/auth/server";

export default async function AdminDashboardPage() {
  await requireAdminSession();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-lime)]">
          Foundation status
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Admin dashboard
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
          Authentication is in place, the admin route is protected, and the workspace is ready for
          the next content management slices.
        </p>
      </div>
    </section>
  );
}
