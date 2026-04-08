import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Serif_SC, Space_Grotesk } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/features/site-config/queries";
import { buildMetadata } from "@/lib/site";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const editorial = Noto_Serif_SC({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings();

  return buildMetadata({
    siteName: settings.siteName,
    title: settings.title,
    description: settings.description,
    url: settings.url,
    locale: settings.locale,
  });
};

const toHtmlLang = (locale: string) => locale.replace(/_/g, "-");

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang={toHtmlLang(settings.locale)}
      className={`${display.variable} ${mono.variable} ${editorial.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(0,244,254,0.11),_transparent_38%),radial-gradient(circle_at_80%_18%,_rgba(183,107,255,0.12),_transparent_28%),linear-gradient(180deg,_rgba(151,255,124,0.03),_transparent_18%)]" />
          <div className="pointer-events-none absolute inset-0 -z-10 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
