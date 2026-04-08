import { getSiteSettings } from "@/features/site-config/queries";
import { getPublicBlogPosts } from "@/features/blog-posts/queries";
import { getNoteEntries, getTravelEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [siteSettings, blogPosts, noteEntries, travelEntries] = await Promise.all([
    getSiteSettings(),
    getPublicBlogPosts(),
    getNoteEntries(),
    getTravelEntries(),
  ]);

  const items = [...blogPosts, ...noteEntries, ...travelEntries]
    .sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime())
    .slice(0, 20)
    .map((item) => ({
      ...item,
      absoluteHref: absoluteUrl(item.href, siteSettings.url),
    }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteSettings.siteName)}</title>
    <link>${siteSettings.url}</link>
    <description>${escapeXml(siteSettings.description)}</description>
    ${items
      .map(
        (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.absoluteHref}</link>
      <guid>${item.absoluteHref}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
