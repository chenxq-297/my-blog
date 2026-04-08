export default async function AdminDashboardPage() {
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

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
            Active slice
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">
            Database-backed blog posts
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-soft)]">
            The next slice turns the admin from a configuration console into a real publishing
            workflow, starting with blog authoring.
          </p>
        </article>

        <article className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--accent-lime)]">
            Next action
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-[var(--foreground)]">Open Blog posts</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted-soft)]">
            Use the new blog editor to create managed posts that appear on the public blog, home
            feed, and sitemap.
          </p>
        </article>
      </div>
    </section>
  );
}
