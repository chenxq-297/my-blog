import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getPublicBlogPosts } from "@/features/blog-posts/queries";

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form writing about software engineering, systems, and reflective essays.",
};

export default async function BlogPage() {
  const posts = await getPublicBlogPosts();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow="Blog"
        title="把技术与长期思考写成可回看的结构。"
        description="这里放的是更完整的文章，适合承载背景、细节、论证和个人判断。"
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {posts.map((post) => (
          <ContentCard
            key={post.href}
            href={post.href}
            title={post.title}
            summary={post.summary}
            date={post.date}
            accent={post.accent}
            meta={post.category}
            tags={post.tags}
          />
        ))}
      </div>
    </div>
  );
}
