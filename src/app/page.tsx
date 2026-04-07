import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import {
  getBlogPosts,
  getNoteEntries,
  getProjectEntries,
  getTravelEntries,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";

const sectionGuides = [
  {
    href: "/blog",
    label: "Blog",
    title: "长文写作",
    description: "关于软件工程、系统设计、长期主义和偶尔出现的偏题思考。",
    accent: "cyan",
  },
  {
    href: "/travel",
    label: "Travel",
    title: "旅行档案",
    description: "把城市、路径、时间和感受重新组织成可回看的片段。",
    accent: "lime",
  },
  {
    href: "/notes",
    label: "Ideas",
    title: "短想法",
    description: "更轻、更快，也更接近即时记录的那层脑内缓存。",
    accent: "violet",
  },
  {
    href: "/projects",
    label: "Projects",
    title: "作品集",
    description: "挑选真正值得展示的项目，把背景、过程和取舍讲清楚。",
    accent: "cyan",
  },
] as const;

export default async function HomePage() {
  const [blogPosts, travelEntries, noteEntries, projectEntries] = await Promise.all([
    getBlogPosts(),
    getTravelEntries(),
    getNoteEntries(),
    getProjectEntries(),
  ]);

  const featuredWriting = [blogPosts[0], noteEntries[0]].filter(Boolean);
  const featuredTravel = travelEntries.slice(0, 2);
  const featuredProjects = projectEntries.slice(0, 2);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
      <section className="grid gap-10 border-b border-[var(--line)] pb-14 lg:grid-cols-[minmax(0,1.35fr)_360px] lg:pb-20">
        <div className="space-y-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3">
              <span className="h-px w-10 bg-[var(--accent-cyan)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-cyan)]">
                Catalogue // code, travel, notes, projects
              </p>
            </div>
            <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              简约地记录，认真地发布，留下一个真正属于自己的站点。
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[var(--muted-soft)]">
              {siteConfig.intro}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {siteConfig.navigation.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--line)] bg-[color:rgba(255,255,255,0.03)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-soft)] transition-colors hover:border-[var(--line-strong)] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
          <div className="space-y-6">
            <div className="rounded-[1.2rem] border border-[color:rgba(183,107,255,0.26)] bg-[color:rgba(183,107,255,0.08)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-violet)]">
                Current status
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-soft)]">
                {siteConfig.status}
              </p>
            </div>

            <div className="space-y-3">
              {siteConfig.heroStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-[1rem] border border-[var(--line)] bg-[color:rgba(255,255,255,0.03)] px-4 py-3"
                >
                  <span className="text-[11px] uppercase tracking-[0.24em] text-[var(--muted-dim)]">
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 py-14 md:grid-cols-2 xl:grid-cols-4">
        {sectionGuides.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-[1.35rem] border border-[var(--line)] bg-[var(--panel)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[var(--line-strong)]"
          >
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
                {section.label}
              </span>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                {section.title}
              </h2>
              <p className="text-sm leading-7 text-[var(--muted-soft)]">{section.description}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="space-y-8 border-t border-[var(--line)] py-14">
        <SectionHeading
          eyebrow="Latest writing"
          title="先从最能代表你的两类内容开始。"
          description="长文和短笔记会成为你最常更新的部分，所以首页先把这两个入口建立起来。"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {featuredWriting.map((entry) => (
            <ContentCard
              key={entry.href}
              href={entry.href}
              title={entry.title}
              summary={entry.summary}
              date={entry.date}
              accent={entry.accent}
              meta={"category" in entry ? entry.category : entry.topic}
              tags={entry.tags}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8 border-t border-[var(--line)] py-14">
        <SectionHeading
          eyebrow="From the road"
          title="旅行内容更适合做成沉浸式但克制的卡片。"
          description="保留图片感和坐标感，但把阅读节奏做得比原始赛博风格更轻一点。"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {featuredTravel.map((entry) => (
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
      </section>

      <section className="space-y-8 border-t border-[var(--line)] py-14">
        <SectionHeading
          eyebrow="Selected work"
          title="作品集保留更多终端感，让它和写作形成层次差异。"
          description="项目页会更像信号面板，但还是维持整站的秩序和可读性。"
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {featuredProjects.map((entry) => (
            <ContentCard
              key={entry.href}
              href={entry.href}
              title={entry.title}
              summary={entry.summary}
              date={entry.date}
              accent={entry.accent}
              meta={entry.status}
              tags={entry.stack}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
