import { getCollection, type CollectionEntry } from "astro:content";

export type Client = CollectionEntry<"clients">;
export type Project = CollectionEntry<"projects">;
export type Post = CollectionEntry<"posts">;

/** The logo wall, in the order the tiles are laid out. */
export async function getClients(): Promise<Client[]> {
  const clients = await getCollection("clients");
  return clients.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Published case studies, in running order.
 *
 * Drafts are kept out of the build, so an unfinished write-up can sit in the
 * repo without appearing on the work index or in the sitemap.
 */
export async function getProjects({
  includeSoon = false,
}: {
  /** Also list clients whose study isn't written yet (`status: soon`). */
  includeSoon?: boolean;
} = {}): Promise<Project[]> {
  const projects = await getCollection(
    "projects",
    ({ data }) => !data.draft && (includeSoon || data.status !== "soon"),
  );
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * The aspect ratio a logo tile should reserve, read off the artwork itself so
 * a replaced file can't disagree with a number written down beside it.
 */
export function logoRatio(logo: ImageMetadata): number {
  return logo.height ? logo.width / logo.height : 1;
}
