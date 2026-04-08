import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { getAboutPage } from "@/features/about/queries";
import { getSiteSettings } from "@/features/site-config/queries";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about the person behind the site, current focus, and working principles.",
};

const toParagraphs = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);

export default async function AboutPage() {
  const [siteSettings, aboutPage] = await Promise.all([getSiteSettings(), getAboutPage()]);
  const profileParagraphs = toParagraphs(aboutPage.profileBody);
  const focusParagraphs = toParagraphs(aboutPage.focusBody);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-14 sm:px-8">
      <SectionHeading
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        description={aboutPage.description}
      />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-8">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-cyan)]">
            {aboutPage.profileHeading}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
            {siteSettings.siteName}
          </h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--muted-dim)]">
            {siteSettings.role} / {siteSettings.location}
          </p>
          <div className="mt-8 space-y-5 text-base leading-8 text-[var(--muted-soft)]">
            {profileParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="border-t border-[var(--line)] pt-5 text-[var(--foreground)]/85">
              {aboutPage.profileBodySecondary}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-[color:rgba(183,107,255,0.26)] bg-[color:rgba(183,107,255,0.08)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-violet)]">
              {aboutPage.focusHeading}
            </p>
            <div className="mt-4 space-y-4 text-base leading-8 text-[var(--muted-soft)]">
              {focusParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--panel)] p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent-lime)]">
              {aboutPage.principlesHeading}
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-[var(--muted-soft)]">
              {aboutPage.principles.map((item) => (
                <li key={item} className="border-t border-[var(--line)] pt-4 first:border-t-0 first:pt-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
