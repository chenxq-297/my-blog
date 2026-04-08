import type { ManagedBlogPost } from "@/features/blog-posts/schema";

type BlogPostFormProps = {
  action: (formData: FormData) => Promise<void>;
  description: string;
  submitLabel: string;
  title: string;
  values: ManagedBlogPost;
};

export function BlogPostForm({
  action,
  description,
  submitLabel,
  title,
  values,
}: BlogPostFormProps) {
  return (
    <form
      action={action}
      className="space-y-8 rounded-[2rem] border border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(17,24,34,0.94),rgba(10,14,20,0.96))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--muted-strong)]">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Title</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.title}
            name="title"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Slug</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.slug}
            name="slug"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Category</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.category}
            name="category"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Summary</span>
          <textarea
            className="min-h-24 w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.summary}
            name="summary"
            required
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Reading time</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.readingTime ?? ""}
            name="readingTime"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Publish date</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.publishedAt}
            name="publishedAt"
            required
            type="date"
          />
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Accent</span>
          <select
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.accent}
            name="accent"
          >
            <option value="cyan">cyan</option>
            <option value="violet">violet</option>
            <option value="lime">lime</option>
          </select>
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)]">
          <span>Tags</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 text-[var(--foreground)]"
            defaultValue={values.tags.join(", ")}
            name="tags"
            placeholder="engineering, note, systems"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--muted-soft)]">
          <input defaultChecked={values.featured} name="featured" type="checkbox" value="true" />
          <span>Featured</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-[var(--muted-soft)]">
          <input defaultChecked={values.published} name="published" type="checkbox" value="true" />
          <span>Published</span>
        </label>

        <label className="space-y-2 text-sm text-[var(--muted-soft)] md:col-span-2">
          <span>Body</span>
          <textarea
            className="min-h-[24rem] w-full rounded-xl border border-[var(--line)] bg-[color:rgba(9,12,18,0.9)] px-3 py-2 font-mono text-sm leading-7 text-[var(--foreground)]"
            defaultValue={values.body}
            name="body"
            required
          />
        </label>
      </div>

      <button
        className="inline-flex items-center rounded-full border border-[color:rgba(0,244,254,0.34)] bg-[color:rgba(0,244,254,0.1)] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-cyan)] transition-colors hover:bg-[color:rgba(0,244,254,0.18)]"
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
