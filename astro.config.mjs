// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE_URL } from "./src/consts.ts";
import { isNoindexRoute } from "./src/utils/seo.ts";

/**
 * Stop the dev server telling browsers to keep generated images for a year.
 *
 * `/_image` answers with `cache-control: public, max-age=31536000`, and the URL
 * it is asked for is built from the source path and the artwork's original
 * dimensions — nothing that changes when the file's *contents* do. Recolour an
 * SVG and the URL is byte-for-byte identical, so any client that already has it
 * keeps showing the old artwork until the cache expires. A production build is
 * unaffected: those filenames carry a content hash.
 *
 * The symptom is confusing rather than obviously a cache: inlined SVGs and CSS
 * update immediately while anything rendered through `<Image>` does not, so a
 * page comes back half-changed.
 */
/** @type {import("vite").Plugin} */
const freshImagesInDev = {
  name: "inparallel:no-image-cache-in-dev",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url?.startsWith("/_image")) {
        /* The endpoint sets the header itself further down the stack, so the
           value is swapped as it is written rather than after the fact. */
        const setHeader = res.setHeader.bind(res);
        res.setHeader = (name, value) =>
          String(name).toLowerCase() === "cache-control"
            ? setHeader(name, "no-store, must-revalidate")
            : setHeader(name, value);
      }
      next();
    });
  },
};

export default defineConfig({
  site: SITE_URL,
  server: {
    /**
     * Pinned so this project always lands on the same address.
     *
     * Astro's default is 4321, and any other Astro project on this machine
     * defaults to it too — whichever server starts first takes the port and
     * the second silently moves to 4322. That makes `localhost:4321` show
     * whichever project happened to boot first.
     */
    port: 4330,
    /**
     * Bind both IP stacks.
     *
     * macOS resolves `localhost` to `::1` before `127.0.0.1`, but a server
     * bound only to `127.0.0.1` isn't listening there — so `localhost:<port>`
     * is refused in anything that doesn't fall back to IPv4. Listening on
     * `::` accepts IPv6 and IPv4 alike, which also makes the server reachable
     * from a phone on the same network.
     */
    host: "::",
  },
  integrations: [
    sitemap({
      filter: (page) => !isNoindexRoute(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [freshImagesInDev],
  },
});
