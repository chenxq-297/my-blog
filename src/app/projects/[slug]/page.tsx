import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article-shell";
import { getProjectEntries, getProjectEntry, renderEntryMdx } from "@/lib/content";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getProjectEntries();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getProjectEntry(slug).catch(() => null);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = await getProjectEntry(slug).catch(() => null);

  if (!project) {
    notFound();
  }

  const content = await renderEntryMdx(project.body);

  return (
    <ArticleShell
      accent={project.accent}
      eyebrow={`${project.status} / Project`}
      title={project.title}
      summary={project.summary}
      date={project.date}
    >
      <div className="mb-10 flex flex-wrap gap-3">
        {project.stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--muted-soft)]"
          >
            {item}
          </span>
        ))}
        {project.repo ? (
          <Link
            className="rounded-full border border-[color:rgba(0,244,254,0.28)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--accent-cyan)]"
            href={project.repo}
          >
            Repo
          </Link>
        ) : null}
        {project.demo ? (
          <Link
            className="rounded-full border border-[color:rgba(183,107,255,0.28)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--accent-violet)]"
            href={project.demo}
          >
            Demo
          </Link>
        ) : null}
      </div>
      {content}
    </ArticleShell>
  );
}
