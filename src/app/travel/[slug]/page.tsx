import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { getTravelEntries, getTravelEntry, renderEntryMdx } from "@/lib/content";

type TravelPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getTravelEntries();
  return entries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: TravelPageProps): Promise<Metadata> {
  const { slug } = await params;

  const entry = await getTravelEntry(slug).catch(() => null);

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.summary,
  };
}

export default async function TravelDetailPage({ params }: TravelPageProps) {
  const { slug } = await params;

  const entry = await getTravelEntry(slug).catch(() => null);

  if (!entry) {
    notFound();
  }

  const content = await renderEntryMdx(entry.body);

  return (
    <ArticleShell
      accent={entry.accent}
      eyebrow={`${entry.destination} / Travel`}
      title={entry.title}
      summary={entry.summary}
      date={entry.date}
    >
      {content}
    </ArticleShell>
  );
}
