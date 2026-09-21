import { defineCollection } from "astro:content";
import { z } from "zod";
import { glob } from "astro/loaders";

/**
 * Clients — the logo wall.
 *
 * The aspect ratio each tile reserves is read off the artwork rather than
 * stored here, so a replaced logo can't disagree with its own dimensions.
 */
const clients = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/clients" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      logo: image(),
      industry: z.string().optional(),
      /** Low numbers come first on the wall. */
      order: z.number().default(0),
      /**
       * Where the tile goes when it is clicked. The client's own site, usually;
       * an internal path such as `/work/trakpro` sends it to the case study
       * instead. A tile without one isn't a link at all.
       */
      href: z.string().optional(),
      /**
       * Turns the tile into a dark, highlighted one carrying a result. The
       * design draws one of these; several still work.
       */
      featured: z
        .object({
          result: z.string(),
        })
        .optional(),
      /**
       * The client whose story runs in the card beside the wall: a YouTube id
       * for the clip, and who is speaking in it.
       */
      story: z
        .object({
          youtube: z.string(),
          speaker: z.string(),
          line: z.string(),
        })
        .optional(),
    }),
});

/**
 * Projects — the case studies.
 *
 * The body of each file is the write-up shown on its own page; the frontmatter
 * is what the cards on the home page and the work index need.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      client: z.string(),
      industry: z.string(),
      /** Card headline, split into the stated half and the faded half. */
      headline: z.string(),
      headlineMuted: z.string(),
      /** The one number this project is remembered by. */
      stat: z.string(),
      statLabel: z.string(),
      /** The client's mark, shown on the card and at the top of the page. */
      logo: image(),
      /** Lead paragraph on the project page, and the card's meta description. */
      summary: z.string(),
      /**
       * The client's own site. Rendered as the "See live website" link at the
       * top of the study; without one the link isn't drawn at all.
       */
      liveUrl: z.url().optional(),
      /**
       * Meta description for this study, when the lead paragraph isn't the
       * sentence you would want a search result to show. Falls back to
       * `summary`.
       */
      metaDescription: z.string().optional(),
      /** Shown as a spec list on the project page. */
      services: z.array(z.string()).default([]),
      timeline: z.string().optional(),
      year: z.number().optional(),
      /** Extra results listed under the headline number. */
      results: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .default([]),
      /** Low numbers come first, and the first two fill the home page. */
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

export const collections = { clients, projects };
