import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { getNoteEntries, getNoteEntry, renderEntryMdx } from "@/lib/content";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const notes = await getNoteEntries();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: NotePageProps): Promise<Metadata> {
  const { slug } = await params;

  const note = await getNoteEntry(slug).catch(() => null);

  if (!note) {
    return {};
  }

  return {
    title: note.title,
    description: note.summary,
  };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;

  const note = await getNoteEntry(slug).catch(() => null);

  if (!note) {
    notFound();
  }

  const content = await renderEntryMdx(note.body);

  return (
    <ArticleShell
      accent={note.accent}
      eyebrow={`${note.topic} / Idea`}
      title={note.title}
      summary={note.summary}
      date={note.date}
    >
      {content}
    </ArticleShell>
  );
}
