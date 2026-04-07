import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/features/auth/login-form";
import { getServerSession } from "@/features/auth/server";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string | string[];
  }>;
};

const getSearchParamValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const session = await getServerSession();
  const authError = getSearchParamValue(params?.error);

  if (session) {
    redirect("/admin");
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--accent-cyan)]">
            Personal blog admin
          </p>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[var(--foreground)] md:text-5xl">
              Sign in to shape the publishing foundation.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted-strong)]">
              This first admin slice protects the workspace before content editing tools land.
            </p>
            {authError === "not-authorized" ? (
              <p
                aria-live="polite"
                className="max-w-xl rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100"
                role="alert"
              >
                This account can sign in, but it does not have access to the admin workspace.
              </p>
            ) : null}
          </div>
        </div>
        <div className="rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.92),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.38)]">
          <div className="mb-8 space-y-2">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">Welcome back</h2>
            <p className="text-sm leading-6 text-[var(--muted-strong)]">
              Use the seeded owner account to access the protected admin dashboard.
            </p>
          </div>
          <AdminLoginForm />
        </div>
      </div>
    </section>
  );
}
