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
      /** The client's own site: where a card without a study goes. */
      href: z.string().optional(),
      /** The case study the card opens, an id in `src/content/projects`. */
      study: z.string().optional(),
      /** The one result the card turns up on hover, from that study. */
      result: z.string().optional(),
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
      /**
       * Pictures of the work. Every field is optional — a study shows what it
       * has. `panel` is the brand-coloured backdrop the case panel sits on,
       * `page` a full-length capture the browser frame scrolls through,
       * `thumbs` other pages of the site, `card` the square shot used on
       * grids and the hero, `desktop`/`mobile` first-screen captures.
       */
      media: z
        .object({
          card: image().optional(),
          panel: image().optional(),
          page: image().optional(),
          /**
           * The three screens on a case panel, each cut from the full capture:
           * the top of the page, and two places further down. Cut rather than
           * shown through a window on the whole capture, which would decode
           * 200MB of page to show a sixth of it.
           */
          screens: z
            .object({ center: image(), left: image(), right: image() })
            .optional(),
          thumbs: z.array(image()).default([]),
          desktop: image().optional(),
          mobile: image().optional(),
          main: image().optional(),
          /** The work grid's card backdrop: the client's colour and mark. */
          cardBg: image().optional(),
          /** The two screens the study opens with, left and right. */
          heroLeft: image().optional(),
          heroRight: image().optional(),
          /** "What they had / what we shipped": the old site and the new. */
          before: image().optional(),
          after: image().optional(),
          gallery: z.array(image()).default([]),
          /** Whole pages of the site, for the slider the panel opens. */
          pages: z
            .array(z.object({ image: image(), name: z.string() }))
            .default([]),
        })
        .default({ thumbs: [], gallery: [], pages: [] }),
      /** The filter the study sits under on the work index. */
      category: z.string().optional(),
      /**
       * `soon` lists the client on the work index without a study page —
       * the work is live, the write-up isn't yet.
       */
      status: z.enum(["live", "soon"]).default("live"),
      /** A client's words about the project, transcribed as said. */
      quote: z
        .object({
          text: z.string(),
          name: z.string(),
          role: z.string().optional(),
          /** The client's film, once it's hosted (a Cloudinary URL). */
          video: z.url().optional(),
        })
        .optional(),
      /** Extra results listed under the headline number. */
      results: z
        .array(z.object({ value: z.string(), label: z.string() }))
        .default([]),
      /** Low numbers come first, and the first two fill the home page. */
      order: z.number().default(0),
      draft: z.boolean().default(false),
    }),
});

/**
 * Posts — the Insights journal.
 *
 * Only the studio's own writing: every post is bylined to one of the two of
 * us. The body is the article; the frontmatter is what the index and the
 * article's head need.
 */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Meta description, and the excerpt on the index. */
      description: z.string(),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      author: z.enum(["aleksandar", "darko"]).default("aleksandar"),
      /** One topic, for the index filters: "Webflow", "SEO & AEO", … */
      category: z.string().optional(),
      cover: image(),
      coverAlt: z.string().default(""),
      /** Minutes, as the original states it. */
      readingTime: z.number().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { clients, projects, posts };
