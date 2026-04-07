import type { Metadata } from "next";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getProjectEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected projects and case studies, with context and technical decisions.",
};

export default async function ProjectsPage() {
  const projects = await getProjectEntries();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow="Projects"
        title="把作品讲成案例，而不是堆成缩略图。"
        description="每个项目页都会尽量说明背景、约束、实现和结果，这比单纯贴技术栈更重要。"
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((project) => (
          <ContentCard
            key={project.href}
            href={project.href}
            title={project.title}
            summary={project.summary}
            date={project.date}
            accent={project.accent}
            meta={project.status}
            tags={project.stack}
          />
        ))}
      </div>
    </div>
  );
}
