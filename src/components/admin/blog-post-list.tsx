import Link from "next/link";

type BlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  updatedAt: string;
};

type BlogPostListProps = {
  posts: BlogPostListItem[];
};

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <section className="space-y-6 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Blog posts
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">
            Manage the database-backed blog posts that appear on the public site.
          </p>
        </div>
        <Link
          className="inline-flex items-center justify-center rounded-full border border-[color:rgba(0,244,254,0.34)] bg-[color:rgba(0,244,254,0.1)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-cyan)] transition-colors hover:bg-[color:rgba(0,244,254,0.18)]"
          href="/admin/blog/new"
        >
          New blog post
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[color:rgba(9,12,18,0.7)] p-6 text-sm leading-7 text-[var(--muted-soft)]">
            No managed blog posts yet. Use <span className="text-[var(--foreground)]">New blog post</span> to publish the first one from the admin backend.
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.7)] p-5 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--muted-dim)]">
                  <span>{post.category}</span>
                  <span>{post.published ? "Published" : "Draft"}</span>
                  {post.featured ? <span>Featured</span> : null}
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{post.title}</h2>
                <p className="text-sm text-[var(--muted-soft)]">
                  /blog/{post.slug} · {post.publishedAt}
                </p>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-dim)]">
                  Updated {new Date(post.updatedAt).toLocaleString("zh-CN")}
                </p>
              </div>

              <Link
                className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-4 py-2 text-sm text-[var(--muted-strong)] transition hover:border-[var(--accent-cyan)] hover:text-[var(--foreground)]"
                href={`/admin/blog/${post.id}`}
              >
                Edit post
              </Link>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
