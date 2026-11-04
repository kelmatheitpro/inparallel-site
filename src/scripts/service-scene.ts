/**
 * How a service runs: its steps as tabs, and beside them one object in the
 * service's colour that takes a new shape with each step.
 *
 * The object is plain CSS 3D, built here the first time it comes near the
 * screen, so the markup stays a stage and a page only pays for what its reader
 * reaches: `[data-scene]` names which of the four to build. Every part carries
 * a pose per step, `[x, y, z, rotateZ, scaleX, scaleY]`, and CSS does the
 * moving between them. The whole world turns slowly on its axis while it's on
 * screen, faster when a step calls for it.
 *
 * Nothing here runs per frame. The turn is a Web Animation and the moves are
 * transitions, all of them on `transform` or `opacity`, so the compositor runs
 * them and a busy page can't make them stutter.
 *
 * Each object is designed inside one frame, and no pose reaches past it at any
 * angle or on the way between two poses. The frame is scaled as a whole to fit
 * its stage, so an object that fits at one width fits at all of them: it can't
 * reach the text, the tabs or the edge of the section.
 *
 * The tabs run by themselves on the progress bar's own animation, so pausing
 * the bar pauses the sequence: it holds while the pointer or the keyboard is on
 * the section, or the section is off screen. Choosing a step ends it for good.
 * A reader who asked for less motion gets the tabs without any of that, and
 * each pose straight away.
 */
type Pose = [
  x: number,
  y: number,
  z: number,
  rz?: number,
  sx?: number,
  sy?: number,
];

interface Scene {
  build: (world: HTMLElement) => HTMLElement[];
  /** One row per step, one pose per part. */
  poses: Pose[][];
  /** How bright the light under the object is, per step. */
  glow: number[];
  /** Degrees a second, per step. */
  speed: number[];
  /** Which part leads the move into a step, as a delay in ms. */
  delay?: (step: number, part: number) => number;
  /** Where the ground sits in the frame, from the top, in percent. */
  ground: number;
  /** How far the camera looks down, in degrees. */
  tilt?: number;
  /** The parts are the mark's strokes, and lean the way it does. */
  lean?: boolean;
  /** Rocks either side of an angle, `[centre, reach]`, instead of going round. */
  sway?: [centre: number, reach: number];
  /** A pose as a transform, where it isn't the usual one. */
  place?: (pose: Pose) => string;
  /** What keeps facing the reader while the world turns. */
  facing?: () => HTMLElement | undefined;
  /** Runs with each step, for what isn't a part. */
  onStep?: (step: number) => void;
}

const LEAN = -32;
const TILT = 62;
/** The angle a world starts at, seen from the front. */
const START = -24;

const div = (className: string, style = "") => {
  const el = document.createElement("div");
  el.className = className;
  if (style) el.style.cssText = style;
  return el;
};

/* A phone draws these small and has less to spare, and from where the camera
   sits a plate only ever shows its rim, so it gets away with fewer. */
const coarse = matchMedia("(pointer: coarse)").matches;

/** A solid part: plates one under the other, `depth` thick, the top one first. */
const slab = (
  count: number,
  depth: number,
  plate: (top: boolean) => HTMLElement,
) => {
  const el = div("sc-part");
  const plates = coarse ? Math.max(2, count - 2) : count;
  for (let k = plates - 1; k >= 0; k--) {
    const layer = plate(k === 0);
    layer.style.transform = `translateZ(${((-k * depth) / (plates - 1)).toFixed(2)}px)`;
    el.append(layer);
  }
  return el;
};

/* ---- the bars: Design & Development ------------------------------------- */
/* Five of the mark's strokes laid side by side. They start as one field, and
   end with the lightest of them leaving the ground. */
const BAR_LENGTH = [230, 300, 340, 300, 230];
const barX = (i: number, gap = 74) => (i - 2) * gap;
const BARS = [0, 1, 2, 3, 4];
/** Every bar as wide as the block they make, and as long. */
const blockOf = (i: number, z: number): Pose => [
  0,
  0,
  z,
  0,
  3.2,
  300 / BAR_LENGTH[i]!,
];

const bars: Scene = {
  ground: 62,
  lean: true,
  build(world) {
    return BAR_LENGTH.map((length, i) => {
      const bar = slab(4, 15, (top) =>
        div(
          `sc-bar${top ? " is-top" : ""}`,
          `--_i:${i};height:${length}px;top:${-length / 2}px;`,
        ),
      );
      world.append(bar);
      return bar;
    });
  },
  poses: [
    /* Discovery: the field, flat, with a light going along it. */
    BARS.map((i) => [barX(i), 0, 0]),
    /* Direction: the same field, climbing. */
    BARS.map((i) => [barX(i), 0, 8 + i * 40]),
    /* Design: still parallel, each slid along its own lean, a stair of them. */
    BARS.map((i) => [barX(i, 60) + (i - 2) * 19, (i - 2) * -31, 26 + i * 38]),
    /* Build: the parts become layers of one thing. */
    BARS.map((i) => blockOf(i, i * 46)),
    /* Launch: it lands as one block, and the lightest goes. */
    BARS.map((i) => blockOf(i, i === 4 ? 276 : i * 17)),
  ],
  glow: [0.42, 0.55, 0.66, 0.78, 1],
  speed: [5, 5, 8, 5, 14],
  /* Coming down the lowest goes first, going up the highest, so none of them
     ever has to pass through another. */
  delay: (step, i) =>
    step === 0 ? i * 45 : step === 2 ? i * 60 : (4 - i) * 45,
};

/* ---- the pages: Webflow Development ------------------------------------- */
/* A stack of pages. Bring a design and it opens out, gets built into a system
   and goes up, with the top one handed over. */
const PAGE_TOPS = ["c0", "c1", "c2", "c3", "c4"];

const pages: Scene = {
  ground: 63,
  build(world) {
    return PAGE_TOPS.map((tone, i) => {
      const page = slab(3, 8, (top) => {
        const layer = div(
          `sc-page${top ? " is-top" : ""}`,
          `--_tone:var(--${tone});--_side:var(--s${i});`,
        );
        if (top) layer.innerHTML = "<b></b><b></b><b></b>";
        return layer;
      });
      world.append(page);
      return page;
    });
  },
  poses: [
    /* Brief: everything in one pile. */
    [
      [0, 0, 0],
      [0, 0, 11, 2],
      [0, 0, 22, -2],
      [0, 0, 33, 3],
      [0, 0, 44, -1],
    ],
    /* Fixed quote: laid out, so what's in it can be seen. */
    [
      [-112, 28, 0, -22],
      [-58, 7, 11, -11],
      [0, 0, 22],
      [58, 7, 33, 11],
      [112, 28, 44, 22],
    ],
    /* Build: the pieces, then the page they make. */
    [
      [-104, -76, 0, 0, 0.55, 0.55],
      [104, -76, 22, 0, 0.55, 0.55],
      [-104, 76, 44, 0, 0.55, 0.55],
      [104, 76, 66, 0, 0.55, 0.55],
      [0, 0, 156, 0, 0.74, 0.74],
    ],
    /* Handoff: a stack again, in order now, and the top page passed on. */
    [
      [0, 0, 120],
      [0, 0, 132],
      [0, 0, 144],
      [0, 0, 156],
      [0, 0, 296],
    ],
  ],
  glow: [0.6, 0.76, 0.88, 1],
  speed: [5, 5, 6, 14],
  delay: (step, i) => (step === 0 ? i * 45 : step < 3 ? i * 55 : (4 - i) * 45),
};

/* ---- the rankings: SEO & AEO -------------------------------------------- */
/* Three blocks, loose and low at the audit, then in line and climbing until
   the tallest holds the top spot. */
const BLOCK = 118;

const block = (tone: string, side: string, shade: string) => {
  const b = BLOCK;
  return `
    <i class="sc-floor" style="width:${b + 60}px;height:${b + 60}px;left:${-(b + 60) / 2}px;top:${-(b + 60) / 2}px"></i>
    <i class="sc-face is-top" style="width:${b}px;height:${b}px;left:${-b / 2}px;top:${-b / 2}px;background-image:linear-gradient(135deg,var(--${tone}),var(--${side}))"></i>
    <i class="sc-face is-front" style="--_face:var(--${side});width:${b}px;height:100px;left:${-b / 2}px;top:-50px;transform:translate3d(0,${b / 2}px,50px) rotateX(90deg)"></i>
    <i class="sc-face" style="width:${b}px;height:100px;left:${-b / 2}px;top:-50px;transform:translate3d(0,${-b / 2}px,50px) rotateX(90deg);background-color:var(--${shade})"></i>
    <i class="sc-face" style="width:100px;height:${b}px;left:-50px;top:${-b / 2}px;transform:translate3d(${b / 2}px,0,50px) rotateY(90deg);background-image:linear-gradient(90deg,var(--${side}),var(--${shade}))"></i>
    <i class="sc-face" style="width:100px;height:${b}px;left:-50px;top:${-b / 2}px;transform:translate3d(${-b / 2}px,0,50px) rotateY(-90deg);background-color:var(--${shade})"></i>`;
};

/* The tag rides the tallest block. It moves by transition; the pill inside it
   runs the world's own turn backwards, so it goes on facing the reader. */
let tag: HTMLElement | undefined;
let pill: HTMLElement | undefined;

const blocks: Scene = {
  ground: 68,
  build(world) {
    const parts = [
      ["c1", "s2", "s0"],
      ["c3", "s3", "s1"],
      ["c4", "c3", "s2"],
    ].map(([tone, side, shade]) => {
      const el = div("sc-part");
      el.innerHTML = block(tone!, side!, shade!);
      world.append(el);
      return el;
    });
    tag = div("sc-tag");
    pill = div("sc-tag_pill");
    pill.textContent = "#1";
    tag.append(pill);
    world.append(tag);
    return parts;
  },
  /* The third figure is the height of the block, not its lift. */
  place: ([x, y, height]) =>
    `translate3d(${x}px,${y}px,0) scale3d(1,1,${height / 100})`,
  poses: [
    [
      [-168, 46, 46],
      [0, -64, 30],
      [158, 36, 62],
    ],
    [
      [-156, 0, 120],
      [0, 0, 68],
      [156, 0, 150],
    ],
    [
      [-128, 0, 110],
      [0, 0, 170],
      [128, 0, 230],
    ],
    [
      [-128, 0, 150],
      [0, 0, 220],
      [128, 0, 290],
    ],
    [
      [-128, 0, 170],
      [0, 0, 240],
      [128, 0, 310],
    ],
  ],
  glow: [0.55, 0.7, 0.8, 0.9, 1],
  speed: [5, 5, 5, 8, 12],
  delay: (step, i) => (step < 2 ? i * 60 : i * 70),
  facing: () => pill,
  onStep(step) {
    const [x, , height] = blocks.poses[step]![2]!;
    if (tag) {
      tag.style.transitionDelay = `${blocks.delay!(step, 2)}ms`;
      tag.style.transform = `translate3d(${x}px,0,${height + 46}px)`;
    }
    if (pill) pill.style.opacity = step >= 3 ? "1" : "0";
  },
};

/* ---- the mark: Growth --------------------------------------------------- */
/* The studio's two strokes in four sizes, smallest on top: a pile that gets
   taller, twists, spreads into a run of releases and sends one up.

   Each stroke is its own part, drawn to the logo's proportions. In the pile
   they all stop at the same line either side of the gap, so however it's
   stacked the gap stays open and it goes on reading as two strokes; anything
   smaller nested round the middle would fill it. */
const STROKE = [168, 132, 96, 60];
const GAP = 46;
const strokeWidth = (size: number) => size * 0.714;

/** Both strokes of one size. `apart` is from the middle to each. */
const pair = (
  [x, y, z]: [number, number, number],
  apart: number,
  turn = 0,
  scale = 1,
): Pose[] =>
  [-1, 1].map((side) => [
    x + side * apart * Math.cos((turn * Math.PI) / 180),
    y + side * apart * Math.sin((turn * Math.PI) / 180),
    z,
    turn,
    scale,
    scale,
  ]);

/** The pile, at these heights and each size turned this far. */
const pile = (height: number[], turn: number[] = []) =>
  STROKE.flatMap((size, level) =>
    pair([0, 0, height[level]!], (GAP + strokeWidth(size)) / 2, turn[level]),
  );

/** One release in the run, half-height `size`, its strokes closer than the next. */
const release = (level: number, x: number, z: number, size: number) =>
  pair([x, 0, z], size * 0.5, 0, size / STROKE[level]!);

const marks: Scene = {
  ground: 62,
  tilt: 54,
  lean: true,
  /* It has to stay legible, and its strokes stop looking like strokes when
     they lie across the view, so it leans either side of the angle that shows
     the logo's own slant instead of going all the way round. */
  sway: [-7, 17],
  build(world) {
    return STROKE.flatMap((size, level) => {
      const width = strokeWidth(size);
      return [0, 1].map(() => {
        const stroke = slab(4, 14, (top) =>
          div(
            `sc-stroke${top ? " is-top" : ""}`,
            `--_tone:var(--c${level + 1});--_side:var(--s${level + 1});width:${width}px;height:${size * 2}px;left:${-width / 2}px;top:${-size}px;`,
          ),
        );
        world.append(stroke);
        return stroke;
      });
    });
  },
  poses: [
    /* Audit: flat, one inside the next. */
    pile([0, 10, 20, 30]),
    /* Roadmap: the pile gets its height. */
    pile([0, 46, 92, 138]),
    /* Design: it twists, each a little further round. */
    pile([0, 62, 124, 186], [0, 13, 26, 39]),
    /* Ship: a run of releases, each bigger than the last. */
    [
      ...release(0, -226, 0, 38),
      ...release(1, -114, 16, 48),
      ...release(2, 16, 32, 60),
      ...release(3, 166, 48, 74),
    ],
    /* Grow: what was learned goes back in, and the next one goes up. */
    pile([46, 60, 74, 280]),
  ],
  glow: [0.6, 0.75, 0.85, 0.9, 1],
  speed: [5, 5, 5, 9, 14],
  delay(step, i) {
    const level = i >> 1;
    if (step === 0) return level * 50;
    if (step === 3) return level * 80;
    return step < 3 ? level * 60 : (3 - level) * 50;
  },
};

const SCENES: Record<string, Scene> = { bars, pages, blocks, marks };

function buildScene(stage: HTMLElement, reduce: boolean) {
  const scene = SCENES[stage.dataset.scene ?? ""];
  if (!scene) return undefined;

  stage.innerHTML = "";
  const frame = div("sc-frame");
  const glow = div("sc-glow", `top:${scene.ground}%`);
  const world = div("sc-world", `top:${scene.ground}%`);
  world.append(div("sc-shadow"));
  const parts = scene.build(world);
  if (scene.poses.length > 4) world.append(div("sc-pulse"));
  frame.append(glow, world);
  stage.append(frame);

  /* The frame takes the room the stage has, and only when that changes. */
  new ResizeObserver(() => {
    frame.style.scale = String(
      Math.min(
        1,
        stage.clientWidth / frame.offsetWidth,
        stage.clientHeight / frame.offsetHeight,
      ),
    );
  }).observe(stage);

  const tilt = scene.tilt ?? TILT;
  const turn = (angle: number) => `rotateX(${tilt}deg) rotateZ(${angle}deg)`;
  const back = (angle: number) => `rotateZ(${-angle}deg) rotateX(${-tilt}deg)`;
  const held = scene.sway?.[0] ?? START;
  world.style.transform = turn(held);
  const facing = scene.facing?.();
  if (facing) facing.style.transform = back(held);

  /* One second at rate 1 is one degree, so a rate is a speed. Going round is
     linear; rocking eases at each end, and alternates to come back. */
  const [centre, reach] = scene.sway ?? [];
  const from = centre === undefined ? START : centre - reach!;
  const to = centre === undefined ? START + 360 : centre + reach!;
  const timing: KeyframeAnimationOptions = {
    duration: (to - from) * 1000,
    iterations: Infinity,
    ...(scene.sway && { direction: "alternate", easing: "ease-in-out" }),
  };
  const spins = reduce
    ? []
    : [
        world.animate(
          [{ transform: turn(from) }, { transform: turn(to) }],
          timing,
        ),
        ...(facing
          ? [
              facing.animate(
                [{ transform: back(from) }, { transform: back(to) }],
                timing,
              ),
            ]
          : []),
      ];
  for (const spin of spins) spin.pause();

  /* The lean goes under the scale, so a part keeps it however it's stretched. */
  const place = ([x, y, z, r = 0, sx = 1, sy = 1]: Pose) =>
    `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,${z}px) rotateZ(${r}deg) skewX(${scene.lean ? LEAN : 0}deg) scale3d(${sx.toFixed(4)},${sy.toFixed(4)},1)`;

  const pose = (step: number) => {
    const row = scene.poses[Math.min(step, scene.poses.length - 1)]!;
    world.dataset.step = String(step);
    parts.forEach((el, i) => {
      el.style.transitionDelay = `${reduce ? 0 : (scene.delay?.(step, i) ?? 0)}ms`;
      el.style.transform = (scene.place ?? place)(row[i]!);
    });
    glow.style.opacity = String(scene.glow[step] ?? 1);
    for (const spin of spins) spin.updatePlaybackRate(scene.speed[step] ?? 5);
    scene.onStep?.(step);
  };

  new IntersectionObserver(
    ([entry]) => {
      const visible = Boolean(entry?.isIntersecting);
      stage.classList.toggle("is-in", visible);
      for (const spin of spins) {
        if (visible) spin.play();
        else spin.pause();
      }
    },
    { threshold: 0.1 },
  ).observe(stage);

  return pose;
}

/**
 * The scene for a stage, built the first time it nears the screen. Until then
 * asking for a step only notes it, and the object starts from there.
 */
function lazyScene(stage: HTMLElement, reduce: boolean) {
  let step = 0;
  let pose: ReturnType<typeof buildScene>;
  const near = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      near.disconnect();
      pose = buildScene(stage, reduce);
      pose?.(step);
    },
    { rootMargin: "50% 0px" },
  );
  near.observe(stage);
  return (next: number) => {
    step = next;
    pose?.(next);
  };
}

function initSteps(root: HTMLElement, reduce: boolean) {
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const panes = tabs.map((tab) =>
    document.getElementById(tab.getAttribute("aria-controls") ?? ""),
  );
  if (tabs.length < 2) return;

  const stage = root.querySelector<HTMLElement>("[data-scene]");
  const pose = stage ? lazyScene(stage, reduce) : undefined;

  let current = 0;
  const hold = new Set<string>();
  const sync = () => root.classList.toggle("is-held", hold.size > 0);

  const select = (next: number, focus = false) => {
    current = next;
    tabs.forEach((tab, i) => {
      const on = i === next;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      panes[i]?.classList.toggle("is-on", on);
    });
    pose?.(next);
    if (focus) tabs[next]!.focus();
  };

  /* Anyone who chose a step keeps it: the sequence ends there. */
  const stop = () => root.classList.add("is-static");

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      stop();
      select(i);
    });
    tab
      .querySelector(".steps_tab_fill")
      ?.addEventListener("animationend", () => {
        if (root.classList.contains("is-static") || i !== current) return;
        select((current + 1) % tabs.length);
      });
  });

  root.addEventListener("keydown", (event) => {
    if (!tabs.includes(document.activeElement as HTMLButtonElement)) return;
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    const move = moves[event.key];
    let next: number | undefined;
    if (move) next = (current + move + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    stop();
    select(next, true);
  });

  const stageBox = root.querySelector<HTMLElement>(".steps_stage") ?? root;
  stageBox.addEventListener("pointerenter", () => {
    hold.add("pointer");
    sync();
  });
  stageBox.addEventListener("pointerleave", () => {
    hold.delete("pointer");
    sync();
  });
  root.addEventListener("focusin", () => {
    hold.add("focus");
    sync();
  });
  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget as Node | null)) return;
    hold.delete("focus");
    sync();
  });

  /* Off screen, nothing runs down: the sequence starts when it's seen. */
  hold.add("away");
  sync();
  new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) hold.delete("away");
      else hold.add("away");
      sync();
    },
    { threshold: 0.35 },
  ).observe(stageBox);

  select(0);
  root.classList.add("is-ready");
  if (reduce) stop();
}

/**
 * An object on its own holds one shape, and runs through the others while the
 * row it sits in is hovered, coming back to the same one after.
 */
function initAlone(stage: HTMLElement, reduce: boolean) {
  const scene = SCENES[stage.dataset.scene ?? ""];
  if (!scene) return;
  const shape = lazyScene(stage, reduce);
  const rest = Number(stage.dataset.rest ?? 0);
  shape(rest);

  const host = stage.closest<HTMLElement>("[data-scene-host]");
  if (!host || reduce) return;
  let timer = 0;
  let step = rest;
  host.addEventListener("pointerenter", () => {
    clearInterval(timer);
    timer = window.setInterval(() => {
      step = (step + 1) % scene.poses.length;
      shape(step);
    }, 1500);
  });
  host.addEventListener("pointerleave", () => {
    clearInterval(timer);
    step = rest;
    shape(rest);
  });
}

let started = false;

export function initServiceScenes() {
  /* One stage can sit on a page several times; one start covers them all. */
  if (started) return;
  started = true;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const root of document.querySelectorAll<HTMLElement>("[data-steps]")) {
    initSteps(root, reduce);
  }
  for (const stage of document.querySelectorAll<HTMLElement>("[data-scene]")) {
    if (!stage.closest("[data-steps]")) initAlone(stage, reduce);
  }
}
