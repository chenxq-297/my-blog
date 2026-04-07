import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { getBlogPost, getBlogPosts, renderEntryMdx } from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getBlogPost(slug).catch(() => null);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await getBlogPost(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  const content = await renderEntryMdx(post.body);

  return (
    <ArticleShell
      accent={post.accent}
      eyebrow={`${post.category} / Blog`}
      title={post.title}
      summary={post.summary}
      date={post.date}
    >
      {content}
    </ArticleShell>
  );
}
