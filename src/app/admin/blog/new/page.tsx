import { BlogPostForm } from "@/components/admin/blog-post-form";
import { createManagedBlogPost } from "@/features/blog-posts/actions";
import { emptyManagedBlogPost } from "@/features/blog-posts/schema";

const toString = (value: FormDataEntryValue | null) => String(value ?? "").trim();

const toBoolean = (formData: FormData, key: string) => {
  const values = formData.getAll(key).map((entry) => String(entry));
  return values.some((entry) => entry === "true" || entry === "on" || entry === "1");
};

const toTags = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

export default function AdminNewBlogPostPage() {
  const submit = async (formData: FormData) => {
    "use server";

    await createManagedBlogPost({
      title: toString(formData.get("title")),
      slug: toString(formData.get("slug")),
      summary: toString(formData.get("summary")),
      body: toString(formData.get("body")),
      category: toString(formData.get("category")),
      readingTime: toString(formData.get("readingTime")) || null,
      publishedAt: toString(formData.get("publishedAt")),
      accent: toString(formData.get("accent")),
      tags: toTags(formData.get("tags")),
      featured: toBoolean(formData, "featured"),
      published: toBoolean(formData, "published"),
    });
  };

  return (
    <section className="space-y-6">
      <BlogPostForm
        action={submit}
        description="Create a database-backed blog post that can appear on the public site."
        submitLabel="Create blog post"
        title="New blog post"
        values={emptyManagedBlogPost}
      />
    </section>
  );
}
