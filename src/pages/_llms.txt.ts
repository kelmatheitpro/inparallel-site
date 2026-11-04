/**
 * /llms.txt — the site, summarised for AI assistants (llmstxt.org).
 *
 * Built from the same data the pages use — the services, the case studies,
 * the posts — so it can't drift from what the site says. Plain markdown:
 * who the studio is, what it does, the proof, and where to read more.
 */
import type { APIRoute } from "astro";
import {
  SITE_NAME,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  SOCIAL_PROOF,
} from "@/consts.ts";
import { SERVICES_P } from "@/data/offer.ts";
import { getProjects, getPosts } from "@/utils/content.ts";

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);
  const projects = await getProjects();
  const posts = await getPosts().catch(() => []);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "inParallel is two people: Aleksandar Dumić (Webflow development) and Darko Milošević (operations & delivery), based in Belgrade, Serbia (CET), working with teams worldwide. Design and build run in parallel, alongside the client's own team, rather than as a relay of handoffs.",
    "",
    `Proof: Webflow Certified Partner; ${SOCIAL_PROOF.score} ${SOCIAL_PROOF.source}; Top Rated Plus on Upwork.`,
    "",
    `Contact: ${CONTACT_EMAIL} · ${url("/contact")}`,
    "",
    "## Services",
    "",
    ...SERVICES_P.map(
      (service) =>
        `- [${service.name}](${url(`/services/${service.slug}`)}): ${service.text}`,
    ),
    "",
    "## Case studies",
    "",
    ...projects.map(
      ({ id, data }) =>
        `- [${data.client}](${url(`/work/${id}`)}) (${data.industry}): ${data.headline} ${data.headlineMuted} — ${data.stat} ${data.statLabel}.`,
    ),
  ];

  if (posts.length) {
    lines.push(
      "",
      "## Insights",
      "",
      ...posts.map(
        ({ id, data }) =>
          `- [${data.title}](${url(`/blog/${id}`)}): ${data.description}`,
      ),
    );
  }

  lines.push(
    "",
    "## More",
    "",
    `- [About the studio](${url("/about")})`,
    `- [Pricing](${url("/pricing")})`,
    `- [Extended team for agencies](${url("/extended-team")})`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
