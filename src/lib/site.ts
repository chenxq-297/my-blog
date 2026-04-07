import type { Metadata } from "next";

export type AccentKey = "cyan" | "violet" | "lime";

export const siteConfig = {
  name: "Your Name",
  role: "Software Engineer",
  location: "Shanghai / Remote",
  title: "代码、旅途与还在形成的想法",
  description:
    "A personal website for a software engineer, collecting long-form writing, travel notes, project case studies, and smaller ideas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  email: "hello@example.com",
  intro:
    "我把这里当作长期档案馆，记录软件工程、旅行途中看到的结构，以及那些还没长成文章的想法。",
  status:
    "Currently building calm systems, shipping small things often, and keeping a better travel log.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/travel", label: "Travel" },
    { href: "/notes", label: "Ideas" },
    { href: "/projects", label: "Projects" },
  ],
  socialLinks: [
    { href: "https://github.com/your-handle", label: "GitHub" },
    { href: "https://www.linkedin.com/in/your-handle", label: "LinkedIn" },
    { href: "mailto:hello@example.com", label: "Email" },
  ],
  heroStats: [
    { label: "Base", value: "Shanghai" },
    { label: "Mode", value: "Specs-first" },
    { label: "Focus", value: "Writing + Building" },
  ],
} as const;

export const accentMap: Record<
  AccentKey,
  {
    label: string;
    textClass: string;
    borderClass: string;
    surfaceClass: string;
    glowClass: string;
  }
> = {
  cyan: {
    label: "Signal",
    textClass: "text-[var(--accent-cyan)]",
    borderClass: "border-[color:rgba(0,244,254,0.38)]",
    surfaceClass: "bg-[color:rgba(0,244,254,0.08)]",
    glowClass: "shadow-[0_0_30px_rgba(0,244,254,0.12)]",
  },
  violet: {
    label: "Archive",
    textClass: "text-[var(--accent-violet)]",
    borderClass: "border-[color:rgba(183,107,255,0.34)]",
    surfaceClass: "bg-[color:rgba(183,107,255,0.08)]",
    glowClass: "shadow-[0_0_30px_rgba(183,107,255,0.12)]",
  },
  lime: {
    label: "Field",
    textClass: "text-[var(--accent-lime)]",
    borderClass: "border-[color:rgba(151,255,124,0.34)]",
    surfaceClass: "bg-[color:rgba(151,255,124,0.08)]",
    glowClass: "shadow-[0_0_30px_rgba(151,255,124,0.12)]",
  },
};

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    type: "website",
    url: siteConfig.url,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.title}`,
    description: siteConfig.description,
  },
};

export function absoluteUrl(pathname: string) {
  return new URL(pathname, siteConfig.url).toString();
}
