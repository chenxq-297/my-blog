import type { BlogPost } from "@/lib/content";
import { sortByDateDescending } from "@/lib/utils";

export const mergeBlogPostSources = (managedPosts: BlogPost[], filePosts: BlogPost[]) => {
  const merged = new Map<string, BlogPost>();
  const managedSlugs = new Set(managedPosts.map((post) => post.slug));

  for (const post of managedPosts.filter((item) => item.published)) {
    merged.set(post.slug, post);
  }

  for (const post of filePosts) {
    if (!managedSlugs.has(post.slug) && !merged.has(post.slug)) {
      merged.set(post.slug, post);
    }
  }

  return sortByDateDescending([...merged.values()]);
};
