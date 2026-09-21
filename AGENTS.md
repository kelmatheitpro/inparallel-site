## Development

The dev server runs on **port 4330**, bound to `::` so it answers on
`localhost`, `127.0.0.1` and the LAN address alike. Both are set in
`astro.config.mjs` — Astro's default 4321 is shared with every other Astro
project on this machine, and a server bound only to `127.0.0.1` is refused on
`localhost` wherever that resolves to IPv6 first.

`npm run dev` passes `--ignore-lock` so it always starts its own server rather
than reporting one an editor (Stacki) already registered for this project.

When starting the dev server as an agent, use background mode instead —
`--ignore-lock` is rejected in agent environments:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
