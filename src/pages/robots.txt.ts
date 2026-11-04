import type { APIRoute } from "astro";

/**
 * The two search engines may read the pages, because that is the only way they
 * can see the `noindex` on them: a page blocked here can still be listed if
 * someone links to it. Everything else, AI crawlers included, stays out.
 */
export const GET: APIRoute = () => {
  const lines = [
    "User-agent: Googlebot",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: *",
    "Disallow: /",
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
