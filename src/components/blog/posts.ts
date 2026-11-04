/**
 * Small helpers the Insights pages share: where a post lives, which topic it
 * files under, how long it takes to read, and what to read next.
 */
import type { Post } from "@/utils/content.ts";

/** The post's address on the site. */
export const postUrl = (post: Post) => `/blog/${post.id}`;

/** A topic as a token for markup and filters: "SEO & AEO" → "seo-aeo". */
export const topicSlug = (category = "Other") =>
  category
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Minutes to read. The figure the original states, when there is one;
 * otherwise worked out from the body at a steady 220 words a minute.
 */
export function readingMinutes(post: Post): number {
  if (post.data.readingTime) return post.data.readingTime;
  const words = (post.body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

/**
 * What to read next: others on the same topic first, newest first, then the
 * newest of the rest to fill the row.
 */
export function relatedPosts(post: Post, all: Post[], count = 3): Post[] {
  const others = all.filter((other) => other.id !== post.id);
  const same = others.filter(
    (other) => other.data.category === post.data.category,
  );
  const rest = others.filter((other) => !same.includes(other));
  return [...same, ...rest].slice(0, count);
}

/** Topics in the order the filter lists them: the busiest first. */
export function topics(
  all: Post[],
): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of all) {
    const name = post.data.category ?? "Other";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, count]) => ({ name, slug: topicSlug(name), count }));
}
