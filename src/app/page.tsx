import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { SectionHeading } from "@/components/section-heading";
import { getHomeSections } from "@/features/home-sections/queries";
import { getSiteSettings } from "@/features/site-config/queries";

const heroStats = [
  { label: "Base", value: "Shanghai" },
  { label: "Mode", value: "Specs-first" },
  { label: "Focus", value: "Writing + Building" },
] as const;

const sectionGuides = [
  {
    href: "/blog",
    label: "Blog",
    title: "Long-form writing",
    description: "Software engineering, systems, and practical notes for long projects.",
  },
  {
    href: "/travel",
    label: "Travel",
    title: "Travel archive",
    description: "Trips, routes, and moments organized for future rereads.",
  },
  {
    href: "/notes",
    label: "Ideas",
    title: "Short ideas",
    description: "Smaller thoughts, experiments, and fast notes worth keeping.",
  },
  {
    href: "/projects",
    label: "Projects",
    title: "Selected work",
    description: "Case studies with context, tradeoffs, and outcomes.",
  },
] as const;

export default async function HomePage() {
  const [siteSettings, homeSections] = await Promise.all([getSiteSettings(), getHomeSections()]);
  const visibleNavigation = siteSettings.navigation.filter((item) => item.isVisible);
  const navigationChips = visibleNavigation.filter((item) => item.href !== "/");

  const hero = homeSections.hero;
  const heroDescription =
    hero.description ??
    "A long-term logbook for shipping software, collecting travel notes, and keeping ideas small enough to iterate.";
  const orderedContentSections = homeSections.sections.filter(
    (section) => section.key !== "HERO" && section.isVisible,
  );

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
      <section className="grid gap-10 border-b border-[var(--line)] pb-14 lg:grid-cols-[minmax(0,1.35fr)_360px] lg:pb-20">
        <div className="space-y-10">
          {hero.isVisible ? (
            <div className="space-y-5">
              <div className="inline-flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--accent-cyan)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent-cyan)]">
                  {hero.eyebrow ?? "Catalogue"}
                </p>
              </div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                {hero.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted-soft)]">{heroDescription}</p>
            </div>
          ) : (
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
                {siteSettings.siteName}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--muted-soft)]">
                Explore writing, travel, notes, and selected work.
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            {navigationChips.map((item) => (
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
              <p className="mt-3 text-sm leading-7 text-[var(--muted-soft)]">{siteSettings.status}</p>
            </div>

            <div className="space-y-3">
              {heroStats.map((item) => (
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

      {orderedContentSections.map((section) => {
        if (section.key === "LATEST_WRITING") {
          return (
            <section className="space-y-8 border-t border-[var(--line)] py-14" key={section.key}>
              <SectionHeading
                eyebrow={homeSections.latestWriting.eyebrow ?? "Latest writing"}
                title={homeSections.latestWriting.title}
                description={
                  homeSections.latestWriting.description ??
                  "Essays and short notes, pulled from the current file-based collections."
                }
              />
              <div className="grid gap-5 lg:grid-cols-2">
                {homeSections.latestWriting.cards.map((entry) => (
                  <ContentCard
                    key={entry.href}
                    href={entry.href}
                    title={entry.title}
                    summary={entry.summary}
                    date={entry.date}
                    accent={entry.accent}
                    meta={entry.meta}
                    tags={entry.tags}
                  />
                ))}
              </div>
            </section>
          );
        }

        if (section.key === "TRAVEL") {
          return (
            <section className="space-y-8 border-t border-[var(--line)] py-14" key={section.key}>
              <SectionHeading
                eyebrow={homeSections.travel.eyebrow ?? "From the road"}
                title={homeSections.travel.title}
                description={
                  homeSections.travel.description ??
                  "A small set of entries that are easy to revisit later."
                }
              />
              <div className="grid gap-5 lg:grid-cols-2">
                {homeSections.travel.cards.map((entry) => (
                  <ContentCard
                    key={entry.href}
                    href={entry.href}
                    title={entry.title}
                    summary={entry.summary}
                    date={entry.date}
                    accent={entry.accent}
                    meta={entry.meta}
                    tags={entry.tags}
                  />
                ))}
              </div>
            </section>
          );
        }

        if (section.key === "SELECTED_WORK") {
          return (
            <section className="space-y-8 border-t border-[var(--line)] py-14" key={section.key}>
              <SectionHeading
                eyebrow={homeSections.selectedWork.eyebrow ?? "Selected work"}
                title={homeSections.selectedWork.title}
                description={
                  homeSections.selectedWork.description ??
                  "Projects that explain context, tradeoffs, and results."
                }
              />
              <div className="grid gap-5 lg:grid-cols-2">
                {homeSections.selectedWork.cards.map((entry) => (
                  <ContentCard
                    key={entry.href}
                    href={entry.href}
                    title={entry.title}
                    summary={entry.summary}
                    date={entry.date}
                    accent={entry.accent}
                    meta={entry.meta}
                    tags={entry.tags}
                  />
                ))}
              </div>
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
