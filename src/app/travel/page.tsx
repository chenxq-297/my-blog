import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getTravelEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Travel",
  description: "Travel stories, city notes, and atmospheric records from the road.",
};

export default async function TravelPage() {
  const entries = await getTravelEntries();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow="Travel"
        title="旅途并不是补充内容，而是这个站点的另一种观察方式。"
        description="这些记录更关注城市气味、光线、路径和某种说不清但会留下来的秩序感。"
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {entries.map((entry) => (
          <ContentCard
            key={entry.href}
            href={entry.href}
            title={entry.title}
            summary={entry.summary}
            date={entry.date}
            accent={entry.accent}
            meta={entry.destination}
            tags={entry.tags}
          />
        ))}
      </div>
    </div>
  );
}
