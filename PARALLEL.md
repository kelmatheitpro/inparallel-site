# inParallel — the parallel system

The site is built on Lumos (tokens in `src/styles/base.css`, cascade layers
`base, patterns, components, utilities`). This file describes the layer of
identity on top of it: one idea — **two strokes, side by side, leaning at the
same angle** — carried through every mark, edge and motion. Read it before
adding a page or a section.

## The idea

The logo is two parallel strokes leaning 32° off vertical (`--slant`,
`--slant-tan: 0.6249`). The name says the rest: two senior people working
alongside a client's team, design and build running at the same time instead
of a relay of handoffs. So:

- **Edges** that lean are cut at `--slant`, never an arbitrary angle.
- **Rules** come in pairs (`.rule-pair`): two hairlines a few pixels apart.
- **Labels** open with the strokes, the way a developer leaves a note in code:
  `// 02 — Work`.
- **Reveals** cut content in along a slanted edge, with the two strokes riding
  that edge (`data-anim="slash"`, `data-anim="image"`, the page change).
- **Bars, bullets, tabs** are parallelograms at the slant — the stroke,
  repeated (`.relay_bar_fill`, `.lane`, `.lane-panel_tick`).
- **Textures** are ribs along the slant (`.ribs`), the flat version of the
  hero's reeded glass.

Copy can lean on the idea ("in parallel", "alongside", "no relay") — once per
section at most. Never at the cost of saying what the work is.

## Palette and type

- Dark sections: navy (`--dark-900` `#0b1322`, hero and footer `--dark-950`).
- Light sections: cream (`--light-200` `#fbfaf7`), cards `--light-100`,
  tiles `--light-300`. Text on cream is `--ink-900`, never black.
- One action blue `--brand-500`, its light tint `--brand-300` for accents on
  dark. Headings on dark are lit (white into `--brand-300`) through the theme
  tokens `--heading-fill` / `--heading-ink`.
- Each service has its own lane colour (`src/data/offer.ts` → `theme`): green
  (Design & Development), blue (Webflow Development), gold (SEO & AEO),
  magenta (Growth). Use them only for that service.
- Type: **Geist Variable** for everything, **Geist Mono** (`--mono-family`)
  for labels, figures in UI, addresses; **Instrument Serif italic**
  (`.serif`) for the one softer word in a heading — at most one per heading.

## Marks (`src/styles/parallel.css`)

| Class | What it is |
| --- | --- |
| `.slash-mark` (+ two `<i>`) | The two strokes, at text size |
| `.label` + `.label_slash` + `.label_text` (+ `.label_index`) | `// 01 — Work` |
| `.rule-pair` (+ two `<i>`) | Parallel rule |
| `.ribs` | Reeded texture along the slant |
| `.serif` | Instrument Serif italic accent |
| `.btn`, `.btn-blue`, `.btn-ghost` | Buttons. At rest only the label; on hover it steps aside, an arrow comes in, and the mark's two strokes cross once behind them (`buttons.ts` wraps the label) |
| `.arrow-circle` (`ArrowCircle.astro`) | The arrow in a circle, or `bare` without one. Hovered, the arrow passes through and the circle fills. Any `a`, `button` or `.arrow-trigger` around it is the trigger |
| `.on-lane` | A section on a service's deep colour: its headings light up in that colour |
| `.cut-left`, `.cut-right` | A panel with one edge cut at the slant |

## Components

- `src/components/parallel/PageHero.astro` — every inner page opens with it:
  the hero's reeded glass at rest, `// label`, slash-cut title, lead, actions,
  optional visual; `accent` tints the light (a service's lane colour).
- `src/components/parallel/SectionHead.astro` — label + slash-cut heading +
  lead (+ `aside` slot). Use it to open every section.
- `src/components/parallel/CtaBand.astro` — the mid-page ask on a band of ribs.
- `src/components/parallel/PageSlash.astro` — the page change: a cross-document
  view transition that cuts the next page in along the slant (in the layout).
- `src/components/parallel/ScrollRail.astro` — reading progress as two
  hairlines along the top edge (pure CSS scroll timeline, in the layout).
- `src/components/parallel/ViewToggle.astro` — "View — Design / Build" in the
  footer: Build view overlays the grid, section names/spacing and type specs.
- `src/components/inparallel/CaseVisual.astro` — a study's picture: three
  screens standing on the panel's foot. Its shape is sized from the panel's
  height, so no width crops it. A click opens `ProjectGallery.astro`.
- `src/components/services/ServiceObject.astro` — a service's object, in CSS 3D:
  bars, pages, blocks or the mark (`src/scripts/service-scene.ts`). Beside the
  steps it takes a pose per step; in a row it holds one and cycles on hover.
- `src/components/services/ServiceFigures.astro` — a service's figures: lanes
  drawn round the mark by the scroll, on a pinned stage.
- `src/components/home/*` — the home page sections; `HeroParallel` holds the
  WebGL glass (`src/scripts/parallel-glass.ts`, driven by `hero-glass.ts`,
  with a baked still for readers it doesn't run for).
- `src/pages/llms.txt.ts` — the site summarised for AI assistants, generated
  from the same data as the pages.

## Motion (`src/scripts/motion.ts`)

GSAP + ScrollTrigger, Lenis smooth scroll on fine pointers. Opt in from markup:

```
data-anim="slash"     heading: each line cut in along the slant, a beat after
                      the line above; the mark's two strokes travel just ahead
                      of the edge
data-intro            (with slash/label) the page's first heading: hidden from
                      first paint and cut in on arrival — desktop only
data-anim="label"     // labels: strokes drop in, words type out
data-anim="rule"      .rule-pair: drawn, second line a beat behind
data-anim="image"     media: wiped open along the slant
data-anim="rise"      anything: up and in (a data-anim-group parent staggers
                      whatever arrives together)
data-anim="count"     a figure climbs to its written value
data-anim="light"     a sentence lights up word by word, in reading order
data-scrub="parallax" (+ data-amount)   drift against the scroll
data-scrub="slide"    (+ data-amount)   drift along the slant
data-scrub="converge" two cards settle into line along their lean (desktop)
data-scrub="figures"  the pinned lanes on a service page
data-cursor="Label"   pointer label over the element
```

The rules the motion keeps:

- **Nothing draws over text you can read.** The cut's strokes stay inside their
  own line's letters, clear of the lines around them, and only ever cross
  space that line hasn't shown yet. The cut is a clip on the heading itself —
  no splitting, so fills, gradients and wrapping stay as authored.
- **Nothing on screen at first paint is hidden** — except `data-intro`
  headings, which the stylesheet hides before the first paint (desktop only,
  so a phone's largest paint never waits) and a failsafe shows after 3 s.
- **Nothing stays hidden.** Triggers re-measure when the page changes height;
  a reveal reached by a jump still plays; anything waiting is released if
  motion is switched off mid-visit; crossing a width breakpoint replays
  nothing.
- **Things that move for long can be stopped** (the work band has a pause
  button) and everything respects reduced motion.

Check any new motion frame by frame (a CDP screencast is enough) for strokes
over text and elements overlapping mid-animation, at 1440, 1100, 768 and 390.
Don't add one-off animation libraries — extend this.

## Content rules

- The studio is **inParallel: Aleksandar and Darko**. Work, numbers and
  testimonials come from projects they delivered; quotes are never reworded
  (bracket an edit, or pick another quote). Don't invent figures, prices,
  clients or dates — leave a visible `TODO` instead.
- No Clutch rating (inParallel has none). Social proof: Webflow Certified
  Partner, 100% Job Success on Upwork (`SOCIAL_PROOF` in `src/consts.ts`).
- The site is built in Astro, not Webflow — don't say otherwise.
- No media hosted by third parties that could show where it's embedded: client
  films go on the studio's own Cloudinary (`video` URLs), never Vimeo/YouTube
  embeds taken from elsewhere.
