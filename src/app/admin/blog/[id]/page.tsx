import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog-post-form";
import { updateManagedBlogPost } from "@/features/blog-posts/actions";
import { getManagedBlogPostById } from "@/features/blog-posts/queries";

type AdminManagedBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

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

export default async function AdminManagedBlogPostPage({
  params,
}: AdminManagedBlogPostPageProps) {
  const { id } = await params;
  const post = await getManagedBlogPostById(id);

  if (!post) {
    notFound();
  }

  const submit = async (formData: FormData) => {
    "use server";

    await updateManagedBlogPost(id, {
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
        description="Update the managed blog post and publish changes to the public site."
        submitLabel="Save blog post"
        title="Edit blog post"
        values={post}
      />
    </section>
  );
}
