import { getCollection, type CollectionEntry } from "astro:content";

export type Client = CollectionEntry<"clients">;
export type Project = CollectionEntry<"projects">;

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
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/**
 * The aspect ratio a logo tile should reserve, read off the artwork itself so
 * a replaced file can't disagree with a number written down beside it.
 */
export function logoRatio(logo: ImageMetadata): number {
  return logo.height ? logo.width / logo.height : 1;
}
