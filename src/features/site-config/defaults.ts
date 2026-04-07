export type SiteSettingsDefaults = {
  siteName: string;
  role: string;
  location: string;
  title: string;
  description: string;
  url: string;
  email: string;
  intro: string;
  status: string;
  locale: string;
};

export type NavItemDefaults = {
  href: string;
  label: string;
  isVisible: boolean;
  sortOrder: number;
};

export type SocialLinkDefaults = {
  href: string;
  label: string;
  isVisible: boolean;
  sortOrder: number;
};

export const defaultSiteSettings: SiteSettingsDefaults = {
  siteName: "Your Name",
  role: "Software Engineer",
  location: "Shanghai / Remote",
  title: "Code, travel, and notes in progress",
  description:
    "A personal website for a software engineer, collecting long-form writing, travel notes, project case studies, and smaller ideas.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "hello@example.com",
  intro:
    "This site is a long-term logbook: engineering notes, travel sketches, and experiments that might grow into something bigger.",
  status:
    "Currently building calm systems, shipping small things often, and keeping a better travel log.",
  locale: "en",
};

export const defaultNavItems: NavItemDefaults[] = [
  { href: "/", label: "Home", isVisible: true, sortOrder: 0 },
  { href: "/about", label: "About", isVisible: true, sortOrder: 1 },
  { href: "/blog", label: "Blog", isVisible: true, sortOrder: 2 },
  { href: "/travel", label: "Travel", isVisible: true, sortOrder: 3 },
  { href: "/notes", label: "Ideas", isVisible: true, sortOrder: 4 },
  { href: "/projects", label: "Projects", isVisible: true, sortOrder: 5 },
];

export const defaultSocialLinks: SocialLinkDefaults[] = [
  { href: "https://github.com/your-handle", label: "GitHub", isVisible: true, sortOrder: 0 },
  { href: "https://www.linkedin.com/in/your-handle", label: "LinkedIn", isVisible: true, sortOrder: 1 },
  { href: "mailto:hello@example.com", label: "Email", isVisible: true, sortOrder: 2 },
];
