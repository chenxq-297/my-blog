import { BlogPostList } from "@/components/admin/blog-post-list";
import { listManagedBlogPosts } from "@/features/blog-posts/queries";

export default async function AdminBlogPostsPage() {
  const posts = await listManagedBlogPosts();

  return (
    <section className="space-y-6">
      <BlogPostList posts={posts} />
    </section>
  );
}
