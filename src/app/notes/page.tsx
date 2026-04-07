import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getNoteEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ideas",
  description: "Short notes, experiments, and ideas that may grow into longer essays.",
};

export default async function NotesPage() {
  const notes = await getNoteEntries();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow="Ideas"
        title="更像缓存区的地方，用来收纳那些还没有长成文章的信号。"
        description="这里的内容更短，也更接近当下的想法和实验。"
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {notes.map((note) => (
          <ContentCard
            key={note.href}
            href={note.href}
            title={note.title}
            summary={note.summary}
            date={note.date}
            accent={note.accent}
            meta={note.topic}
            tags={note.tags}
          />
        ))}
      </div>
    </div>
  );
}
