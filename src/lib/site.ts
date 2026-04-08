import type { Metadata } from "next";
import { defaultSiteSettings } from "@/features/site-config/defaults";

export type AccentKey = "cyan" | "violet" | "lime";

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

type MetadataSiteInput = {
  siteName: string;
  title: string;
  description: string;
  url: string;
  locale: string;
};

export const buildMetadata = (site: MetadataSiteInput): Metadata => ({
  metadataBase: new URL(site.url),
  title: {
    default: `${site.siteName} | ${site.title}`,
    template: `%s | ${site.siteName}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.siteName} | ${site.title}`,
    description: site.description,
    siteName: site.siteName,
    type: "website",
    url: site.url,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.siteName} | ${site.title}`,
    description: site.description,
  },
});

export function absoluteUrl(pathname: string, siteUrl: string = defaultSiteSettings.url) {
  return new URL(pathname, siteUrl).toString();
}
