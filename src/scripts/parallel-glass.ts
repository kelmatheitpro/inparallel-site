/**
 * The hero glass, in plain WebGL 2.
 *
 * A pane of reeded glass whose ribs lean at the logo's angle, with the mark's
 * two strokes glowing behind it. Each rib is a small cylindrical lens: it
 * gathers the light behind it into a band, so two soft strokes come through
 * as a field of parallel lines — the name, as a material. A light behind the
 * pane follows the pointer, and every rib catches it along its crest.
 *
 * Loaded on demand by `hero-glass.ts`, which decides whether it runs at all.
 * One full-screen triangle, one fragment shader, no textures.
 */

const VERT = /* glsl */ `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_res;        // drawing buffer, px
uniform float u_time;      // seconds
uniform vec3 u_pointer;    // xy in 0..1 (y up), z = how lit (0..1)
uniform float u_intro;     // 0..1 as the hero arrives
uniform float u_scroll;    // 0..1 as the hero leaves
uniform float u_rib;       // rib width as a share of the height
uniform vec2 u_focus;      // where the strokes stand, 0..1
uniform float u_ribAngle;  // the ribs' lean off vertical, radians

// The logo's strokes lean 32 degrees off vertical.
const vec2 ALONG = vec2(0.52992, 0.84805);
const vec2 ACROSS = vec2(0.84805, -0.52992);

const vec3 NIGHT = vec3(0.020, 0.031, 0.055);
const vec3 NAVY = vec3(0.035, 0.062, 0.125);
const vec3 BLUE = vec3(0.165, 0.427, 0.855);   // #2a6dda
const vec3 SKY = vec3(0.545, 0.718, 1.0);      // #8bb7ff

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// A soft parallelogram: one of the mark's strokes, blurred to light.
float stroke(vec2 p, vec2 centre, float halfLen, float halfWidth, float blur) {
  vec2 d = p - centre;
  float a = dot(d, ALONG);
  float c = dot(d, ACROSS);
  float across = smoothstep(halfWidth + blur, halfWidth - blur * 0.2, abs(c));
  float along = smoothstep(halfLen + blur * 2.5, halfLen - blur, abs(a));
  return across * along;
}

// What stands behind the glass, in aspect-corrected units (height = 1).
vec3 scene(vec2 p, float aspect) {
  float t = u_time;
  vec2 focus = (u_focus - 0.5) * vec2(aspect, 1.0);

  // The room: deep navy, darker toward the copy on the left and the floor.
  float lift = smoothstep(-0.9, 0.7, p.x / aspect * 1.4 + p.y * 0.35);
  vec3 col = mix(NIGHT, NAVY, lift * 0.85);

  // A slow wash of blue drifting behind the strokes.
  vec2 drift = focus + vec2(sin(t * 0.11) * 0.18, cos(t * 0.09) * 0.12);
  float wash = exp(-dot(p - drift, p - drift) * 2.2);
  col += BLUE * wash * 0.28;

  // The mark's two strokes, side by side, breathing out of step.
  float grow = smoothstep(0.0, 1.0, u_intro);
  float len = mix(0.02, 0.5, grow);
  float gap = 0.25;
  vec2 offset = ACROSS * gap * 0.5;
  float slide = (1.0 - grow) * 0.35 + u_scroll * 0.25;
  float s1 = stroke(p, focus - offset - ALONG * slide, len, 0.036, 0.05);
  float s2 = stroke(p, focus + offset + ALONG * slide, len, 0.036, 0.05);
  float b1 = 0.85 + 0.15 * sin(t * 0.7);
  float b2 = 0.85 + 0.15 * sin(t * 0.7 + 2.1);
  col += mix(BLUE, SKY, 0.25) * s1 * 1.25 * b1;
  col += mix(BLUE, SKY, 0.55) * s2 * 1.1 * b2;
  // A hot core inside each stroke.
  col += SKY * stroke(p, focus - offset - ALONG * slide, len * 0.85, 0.012, 0.03) * 0.55 * b1;
  col += SKY * stroke(p, focus + offset + ALONG * slide, len * 0.85, 0.012, 0.03) * 0.55 * b2;

  // The light the pointer carries behind the pane.
  vec2 lp = (u_pointer.xy - 0.5) * vec2(aspect, 1.0);
  float lamp = exp(-dot(p - lp, p - lp) * 9.0);
  col += mix(SKY, vec3(1.0), 0.15) * lamp * 0.5 * u_pointer.z;

  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float aspect = u_res.x / u_res.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);

  // Which rib this pixel looks through, and where across it.
  vec2 ribAcross = vec2(cos(u_ribAngle), -sin(u_ribAngle));
  float u = dot(p, ribAcross) / u_rib + u_time * 0.015;
  float f = fract(u) - 0.5;              // -0.5 .. 0.5 across the rib
  float normal = f * 2.0;                // the rib's curve: -1 .. 1

  // Each rib bends the light across itself: a mirrored, magnified slice.
  float bend = mix(0.0, 1.55, smoothstep(0.0, 0.7, u_intro));
  vec2 shift = ribAcross * (-f * u_rib * bend);
  // Three looks across the rib: a little blur, and the colours parting at
  // its edges the way real glass splits them.
  vec2 q = p + shift;
  vec2 spread = ribAcross * u_rib * (0.16 + abs(normal) * 0.12);
  vec3 a = scene(q - spread, aspect);
  vec3 b = scene(q, aspect);
  vec3 c = scene(q + spread, aspect);
  vec3 col = vec3((a.r + b.r) * 0.5, (a.g + b.g + c.g) / 3.0, (b.b + c.b) * 0.5);

  // The pane itself: a crest that catches the lamp, and a dark seam between ribs.
  vec2 lp = (u_pointer.xy - 0.5) * vec2(aspect, 1.0);
  float side = clamp(dot(lp - p, ribAcross) * 2.5, -1.0, 1.0);
  float crest = pow(max(0.0, 1.0 - abs(normal - side * 0.55)), 14.0);
  float near = exp(-dot(p - lp, p - lp) * 3.0);
  col += SKY * crest * (0.025 + 0.11 * near * u_pointer.z);
  float seam = smoothstep(0.40, 0.5, abs(f));
  col *= 1.0 - seam * 0.45;
  col += SKY * (1.0 - smoothstep(0.0, 0.03, abs(abs(f) - 0.455))) * 0.03;

  // Soft shoulder, so the strokes glow instead of clipping to white.
  col = 1.0 - exp(-col * 1.15);

  // Fade in, darken as the hero leaves, and a little grain against banding.
  col *= smoothstep(0.0, 0.35, u_intro) * (1.0 - u_scroll * 0.55);
  float vignette = smoothstep(1.45, 0.35, length(p * vec2(0.8, 1.1)));
  col *= mix(0.55, 1.0, vignette);
  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) * 0.012;

  outColor = vec4(col, 1.0);
}
`;

export interface Glass {
  start(): void;
  stop(): void;
  /** Pointer in the canvas's own 0..1 coordinates (y down), or null to let the light go out. */
  point(x: number | null, y?: number): void;
  /** 0 while the hero fills the screen, 1 once it has scrolled away. */
  leave(amount: number): void;
  resize(): void;
  dispose(): void;
}

export interface GlassOptions {
  /** Device pixel ratio cap. */
  maxDpr?: number;
  /** Where the strokes stand, in 0..1 of the canvas (y up). */
  focus?: [number, number];
  /** The ribs' lean off vertical, in degrees, once they have settled. */
  ribAngle?: number;
  /** Where the ribs start as the hero arrives, in degrees. */
  ribFrom?: number;
  /** Called after the first frame lands, so the poster can step aside. */
  onFirstFrame?: () => void;
}

export function createGlass(
  canvas: HTMLCanvasElement,
  options: GlassOptions = {},
): Glass | null {
  const gl = canvas.getContext("webgl2", {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`glass shader: ${log}`);
    }
    return shader;
  };

  let program: WebGLProgram;
  try {
    program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(`glass link: ${gl.getProgramInfoLog(program)}`);
  } catch (error) {
    console.warn(error);
    return null;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(program, "a_pos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl.getUniformLocation(program, name);
  const uRes = u("u_res");
  const uTime = u("u_time");
  const uPointer = u("u_pointer");
  const uIntro = u("u_intro");
  const uScroll = u("u_scroll");
  const uRib = u("u_rib");
  const uFocus = u("u_focus");
  const uRibAngle = u("u_ribAngle");

  /* The resolution cap. It starts at what the caller allows and steps down
     once if the device can't hold the frame rate — see `watch` below. */
  let maxDpr = options.maxDpr ?? 1.5;
  /* The ribs arrive level, like slats, and turn until they run parallel to
     the strokes — the moment the light resolves into lines. */
  const ribTo = ((options.ribAngle ?? 32) * Math.PI) / 180;
  const ribFrom = ((options.ribFrom ?? options.ribAngle ?? 32) * Math.PI) / 180;
  const focus = options.focus ?? [0.68, 0.5];

  let frame = 0;
  let running = false;
  let first = true;
  const born = performance.now();
  let last = born;

  /* The light eases toward the pointer, and its brightness toward on/off. */
  const pointer = { x: focus[0], y: focus[1], lit: 0 };
  const target = { x: focus[0], y: focus[1], lit: 0 };
  let scroll = 0;
  let intro = 0;
  let arrived: number | undefined;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);
    /* Ribs about 30 CSS px wide whatever the screen, never fewer than ~24 across. */
    const rib = Math.min(30 / Math.max(1, canvas.clientHeight), 0.06);
    gl.uniform1f(uRib, rib);
  };

  /* Frame-time watch: over the first stretch of frames, a pane that can't
     keep up drops to one device pixel per CSS pixel. The glass is mostly
     soft light, so the step down costs little to the eye. */
  let watched = 0;
  let spent = 0;
  const watch = (dt: number) => {
    if (watched < 0) return;
    watched += 1;
    spent += dt;
    if (watched < 90) return;
    if (spent / watched > 0.022 && maxDpr > 1) {
      maxDpr = 1;
      resize();
    }
    watched = -1;
  };

  const draw = (now: number) => {
    const raw = (now - last) / 1000;
    const dt = Math.min(0.05, raw);
    last = now;
    if (!first) watch(raw);
    const time = (now - born) / 1000;
    /* Measured in real time from the first frame, not added up frame by
       frame: a slow device drops frames, but its intro takes no longer. */
    arrived ??= now;
    intro = Math.min(1, (now - arrived) / 2400);
    const ease = 1 - Math.pow(0.002, dt);
    pointer.x += (target.x - pointer.x) * ease;
    pointer.y += (target.y - pointer.y) * ease;
    pointer.lit += (target.lit - pointer.lit) * (1 - Math.pow(0.05, dt));

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform3f(uPointer, pointer.x, pointer.y, pointer.lit);
    gl.uniform1f(uIntro, 1 - Math.pow(1 - intro, 3));
    gl.uniform1f(uScroll, scroll);
    gl.uniform2f(uFocus, focus[0], focus[1]);
    /* The turn takes its time and eases at both ends, so the moment the
       ribs come parallel to the strokes is something you see happen. */
    const t = Math.min(1, Math.max(0, (intro * 2.4 - 0.35) / 2.05));
    const turn = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    gl.uniform1f(uRibAngle, ribFrom + (ribTo - ribFrom) * turn);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (first) {
      first = false;
      options.onFirstFrame?.();
    }
    if (running) frame = requestAnimationFrame(draw);
  };

  resize();

  return {
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    },
    stop() {
      running = false;
      cancelAnimationFrame(frame);
    },
    point(x, y) {
      if (x === null || y === undefined) {
        target.lit = 0;
        return;
      }
      target.x = x;
      target.y = 1 - y;
      target.lit = 1;
    },
    leave(amount) {
      scroll = Math.min(1, Math.max(0, amount));
    },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
