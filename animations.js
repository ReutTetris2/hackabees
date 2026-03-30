/**
 * hackabees ASCII animations
 * Three concepts — A (Flame), B (Hills), C (Menorah)
 * Each exports a standalone init function.
 * Black background, #00ff00 green, #ffb000 amber accents.
 * Rendered into a <pre> via setInterval frame-swap.
 *
 * Usage per concept — drop one block into index.html
 * immediately before or after the relevant section header.
 */

// ─────────────────────────────────────────────────────────────
// SHARED UTILITIES
// ─────────────────────────────────────────────────────────────

function makeContainer(id, colorClass) {
  const pre = document.createElement('pre');
  pre.id = id;
  pre.setAttribute('aria-hidden', 'true'); // decorative
  pre.style.cssText = [
    'font-family:"VT323",monospace',
    'font-size:18px',
    'line-height:1.35',
    'background:#000000',
    'display:block',
    'white-space:pre',
    'margin:1.4rem 0',
    'user-select:none',
    // CRT-style faint phosphor glow on the whole block
    colorClass === 'amber'
      ? 'color:#ffb000;text-shadow:0 0 6px rgba(255,176,0,0.45)'
      : 'color:#00ff00;text-shadow:0 0 6px rgba(0,255,0,0.35)',
  ].join(';');
  return pre;
}

// ─────────────────────────────────────────────────────────────
// CONCEPT A — THE FLAME
// ─────────────────────────────────────────────────────────────
//
// Placement: inject just before "─── THE FLAME ───" section header
//            (after "They broke four hundred years of silence." line)
//
// Behaviour:
//   Phase 1 — "grow" sequence plays once (frames 0 → 3), each held 300ms
//   Phase 2 — once fully grown, the flame flickers forever between
//              frames 3/4/5 (the three full-height flicker states)
//              at 120 / 80 / 100 ms — irregular, intentional
//
// Dimensions: 52 chars wide × 13 lines tall
//
// The cruse never changes.  Only the flame moves.
// Characters chosen for weight not cuteness:
//   )  (  |  '  ,  ^  Y — rough, asymmetric, suggest combustion

const FLAME_FRAMES = [

  // frame 0 — ember. Just lit. One char.
  [
    '                                        ',
    '                   .                    ',
    '                   |                    ',
    '                                        ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 1 — small tongue
  [
    '                                        ',
    '                  ( )                   ',
    '                   |                    ',
    '                   |                    ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 2 — flame growing, tilted right
  [
    '                                        ',
    '                  )  )                  ',
    '                 ) | (                  ',
    '                  \\|/                   ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 3 — full flame, upright  [PRIMARY steady state]
  [
    '                  ( )                   ',
    '                 ) Y (                  ',
    '                ) )|(                   ',
    '                  \\|/                   ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 4 — flicker: leans left, compressed
  [
    '                                        ',
    '                (  )                    ',
    '               ( )|( )                  ',
    '                  |,                    ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 5 — flicker: tall, narrow, wind-blown
  [
    '                   (                    ',
    '                  (Y)                   ',
    '                 ) | (                  ',
    '                  )|,(                  ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],

  // frame 6 — near-out: just a coal glow, cruse still solid
  [
    '                                        ',
    '                   ,                    ',
    '                   .                    ',
    '                                        ',
    '                 __|__                  ',
    '                /     \\                 ',
    '               | _   _ |               ',
    '               |/ \\_/ \\|               ',
    '                \\  |  /                 ',
    '                 \\___/                  ',
    '               [  oil  ]               ',
    '                                        ',
    '                                        ',
  ],
];

// Grow phase: frame indices to play once, with hold-times (ms)
const FLAME_GROW = [
  { idx: 0, hold: 600 },
  { idx: 1, hold: 400 },
  { idx: 2, hold: 300 },
  { idx: 3, hold: 350 },
];

// Flicker sequence: runs forever after grow.
// Occasionally drops to frame 6 (near-out) then recovers — adds dread.
const FLAME_FLICKER_SEQ = [
  { idx: 3, hold: 140 },
  { idx: 4, hold: 90  },
  { idx: 3, hold: 120 },
  { idx: 5, hold: 80  },
  { idx: 3, hold: 200 },
  { idx: 4, hold: 70  },
  { idx: 3, hold: 160 },
  { idx: 5, hold: 90  },
  { idx: 3, hold: 300 },
  // near-extinction moment
  { idx: 6, hold: 180 },
  { idx: 1, hold: 100 },
  { idx: 3, hold: 120 },
  { idx: 5, hold: 80  },
  { idx: 3, hold: 250 },
];

function initFlame(targetEl) {
  const pre = makeContainer('anim-flame', 'amber');
  // amber colour for the flame
  pre.style.color = '#ffb000';
  pre.style.textShadow = '0 0 8px rgba(255,176,0,0.55), 0 0 18px rgba(255,176,0,0.2)';
  targetEl.insertAdjacentElement('beforebegin', pre);

  function render(frameIdx) {
    pre.textContent = FLAME_FRAMES[frameIdx].join('\n');
  }

  let growStep = 0;
  let flickerStep = 0;
  let timer = null;

  function stepGrow() {
    const { idx, hold } = FLAME_GROW[growStep];
    render(idx);
    growStep++;
    if (growStep < FLAME_GROW.length) {
      timer = setTimeout(stepGrow, hold);
    } else {
      // Hand off to flicker loop
      timer = setTimeout(stepFlicker, 200);
    }
  }

  function stepFlicker() {
    const { idx, hold } = FLAME_FLICKER_SEQ[flickerStep % FLAME_FLICKER_SEQ.length];
    render(idx);
    flickerStep++;
    timer = setTimeout(stepFlicker, hold);
  }

  // Begin
  render(0);
  timer = setTimeout(stepGrow, 800);

  return () => clearTimeout(timer); // teardown
}


// ─────────────────────────────────────────────────────────────
// CONCEPT B — THE HILLS (Modi'in escape)
// ─────────────────────────────────────────────────────────────
//
// Placement: inject just after "─── WHO WE ARE ───" section header,
//            before "The decree was specific." — sets the scene.
//
// Behaviour:
//   A lone figure runs left→right across the screen in 8 frames.
//   The hills are fixed. Night sky shows one star (*) that blinks.
//   When the figure reaches the hills it disappears (absorbed into
//   darkness). Then a 2-second pause, then it loops from the left.
//   Speed: 220ms per step — urgent but readable.
//
// Dimensions: 50 chars wide × 13 lines tall
//
// The star blinks independently from figure movement via a
// separate interval — small flicker of light in the dark.

// Figure at different horizontal positions, 8 steps across.
// Terrain is constant. Figure is: head=o, body=|, arms=\-/, legs=/ \
// At full sprint: leaning forward, back leg trailing.
// Two stride phases alternate (A and B) for a running cycle.

const HILLS_TERRAIN = [
  // sky          50 chars, padded
  '                                *         ',
  '                                          ',
  '     /\\          /\\                       ',
  '    /  \\    /\\  /  \\                      ',
  '   /    \\  /  \\/    \\      /\\             ',
  '--/------\\/----------\\----/  \\------------',
  '--\\-----------------------------/  \\------',
  '---\\---------------------------/    \\-----',
];
// figure positions: column offsets for the 'o' (head)
// steps 0–7 move from col 2 to col 40
const FIGURE_COLS = [2, 7, 12, 17, 22, 27, 32, 38];

// Two stride frames (A = left foot fwd, B = right foot fwd)
// expressed as row offsets from head position, char by char:
//   row 0: head
//   row 1: body
//   row 2: arms/torso
//   row 3: legs

const STRIDE_A = [
  'o',      // head
  '/|',     // torso lean
  '/ ',     // front arm / trailing arm
  '/ \\',   // legs: front fwd, back trailing
];
const STRIDE_B = [
  'o',
  '|\\',
  ' \\',
  '\\ /',
];

function buildHillsFrame(figureCol, strideFrame, starOn) {
  // Copy terrain into a mutable char grid
  const W = 50;
  const rows = HILLS_TERRAIN.map(r => {
    // pad / trim to W
    let s = r.padEnd(W, ' ');
    return s.split('');
  });

  // Add two more rows below terrain for figure legs
  // terrain is 8 rows (indices 0–7)
  // figure head appears at row 5 (just above ground line at row 5)
  // Ground line is row 5 ('--/---…')
  // We want figure to stand ON the ground — head at row 4, legs at row 6
  // But rows 6,7 are below the horizon fill — figure should be in front
  // Let's place figure head at row 3, body rows 3-6

  // Blink the star
  if (!starOn) {
    rows[0][32] = ' ';
  }

  // Paint figure — head at row 3, col figureCol
  // Only paint if col is before the hills swallow them (col < 44)
  if (figureCol < 44) {
    const stride = strideFrame === 0 ? STRIDE_A : STRIDE_B;
    const headRow = 4;
    const headCol = figureCol;

    // head
    if (headCol < W) rows[headRow][headCol] = stride[0]; // 'o'

    // torso (row headRow+1, two chars)
    const torso = stride[1];
    for (let i = 0; i < torso.length; i++) {
      const c = headCol - 1 + i;
      if (c >= 0 && c < W) rows[headRow + 1][c] = torso[i];
    }

    // arms (row headRow+2)
    const arms = stride[2];
    for (let i = 0; i < arms.length; i++) {
      const c = headCol - 1 + i;
      if (c >= 0 && c < W) rows[headRow + 2][c] = arms[i];
    }

    // legs (row headRow+3, three chars)
    const legs = stride[3];
    for (let i = 0; i < legs.length; i++) {
      const c = headCol - 1 + i;
      if (c >= 0 && c < W) rows[headRow + 3][c] = legs[i];
    }
  }

  // Add bottom padding rows
  const grid = rows.map(r => r.join(''));
  // Pad to 13 lines
  while (grid.length < 13) grid.push(' '.repeat(W));
  return grid.join('\n');
}

function initHills(targetEl) {
  const pre = makeContainer('anim-hills', 'green');
  targetEl.insertAdjacentElement('afterend', pre);

  let step = 0;
  let stride = 0;
  let starOn = true;
  let starTimer = null;
  let stepTimer = null;

  // Star blinks on its own irregular interval
  function blinkStar() {
    starOn = !starOn;
    starTimer = setTimeout(blinkStar, starOn ? 600 + Math.random() * 400 : 120 + Math.random() * 80);
  }
  blinkStar();

  function tick() {
    pre.textContent = buildHillsFrame(FIGURE_COLS[step], stride, starOn);
    stride = 1 - stride; // alternate stride
    step++;

    if (step >= FIGURE_COLS.length) {
      // Figure has reached the hills — pause, then restart
      step = 0;
      stride = 0;
      stepTimer = setTimeout(tick, 2200); // long pause: darkness, then re-emerges
    } else {
      stepTimer = setTimeout(tick, 220);
    }
  }

  tick();

  return () => { clearTimeout(stepTimer); clearTimeout(starTimer); };
}


// ─────────────────────────────────────────────────────────────
// CONCEPT C — THE MENORAH (8 lights)
// ─────────────────────────────────────────────────────────────
//
// Placement: inject just after "It burned for eight." line,
//            immediately before "We build like that." — the
//            visual payoff of the oil miracle.
//
// Behaviour:
//   Lights appear one at a time, right-to-left (dramatic left-to-right
//   reveal in reading order, but Hanukkah tradition is right-to-left).
//   The shamash (center servant candle, taller) lights last.
//   Each candle ignites on a 700ms interval — slow, deliberate.
//   After all 9 are lit, the flame flickers forever (3 flicker states
//   swap every 150ms on the lit wicks only).
//
//   Frame 0: bare hanukkiah (structure only)
//   Frames 1–8: candles 8 down to 1 (right-to-left), shamash last
//   Flicker phase: subtle variation in flame chars on lit positions
//
// Dimensions: 50 chars wide × 14 lines tall
//
// Hanukkiah structure:
//   9 branches: 8 equal-height outer + 1 taller center (shamash)
//   Base: horizontal bar + pedestal stem
//   Candles: vertical pipe + flame char on top

// Branch/candle positions (column of the center of each candle).
// Layout: 50 chars wide. Branches at cols 2,7,12,17,24(shamash),31,36,41,46
// Shamash is at index 4 (center), taller by 2 rows.
// Outer candles: indices 0,1,2,3,5,6,7,8
// Lighting order (right to left): 8,7,6,5,3,2,1,0 then shamash(4)

const BRANCH_COLS     = [3, 8, 13, 18, 24, 30, 35, 40, 45];
const SHAMASH_IDX     = 4;
const LIGHT_ORDER     = [8, 7, 6, 5, 3, 2, 1, 0, 4]; // 4=shamash last

// We build the frame as a character grid, 50w × 14h

function buildMenorahGrid(litSet, flickerPhase) {
  const W = 50;
  const H = 14;
  // Row indices (0-based from top)
  // Row 0–1: shamash flame area (shamash only)
  // Row 2–3: outer candle flame area
  // Row 4: candle tops (all, stub or flame)
  // Row 5–6: outer candle bodies
  // Row 7–8: shamash body (two extra rows)
  // Row 7:  horizontal arm bar
  // Row 8:  downward connector stubs from arms to base rail
  // Row 9:  base rail
  // Row 10: pedestal top
  // Row 11–12: pedestal stem
  // Row 13: base feet

  const grid = Array.from({ length: H }, () => Array(W).fill(' '));

  function put(row, col, ch) {
    if (row >= 0 && row < H && col >= 0 && col < W) grid[row][col] = ch;
  }
  function putStr(row, colStart, str) {
    for (let i = 0; i < str.length; i++) put(row, colStart + i, str[i]);
  }

  // ── Menorah structure ──────────────────────────────────────

  // Horizontal arm bar row 8 — spans col 3 to col 45
  for (let c = BRANCH_COLS[0]; c <= BRANCH_COLS[8]; c++) {
    put(8, c, '_');
  }
  // Slight uptick at ends
  put(8, BRANCH_COLS[0] - 1, '/');
  put(8, BRANCH_COLS[8] + 1, '\\');

  // Vertical connector from each branch position down to arm bar
  // (each branch goes UP from the arm; the arm is at row 8)
  // Outer candles: body rows 5–7 (3 rows above arm)
  // Shamash: body rows 3–7 (5 rows above arm — taller)

  BRANCH_COLS.forEach((col, idx) => {
    const isShamash = idx === SHAMASH_IDX;
    const bodyTop   = isShamash ? 3 : 5;
    // Draw vertical stem upward from arm
    for (let r = bodyTop; r <= 7; r++) {
      put(r, col, '|');
    }
    // Small bump at arm for non-shamash
    if (!isShamash) {
      put(8, col, '|'); // override the '_' with '|' at branch
    }
  });

  // Pedestal: central stem below arm
  // Row 9: base rail '===…==='
  putStr(9, 18, '===========' + '=' + '===========');
  // Row 10: pedestal block
  putStr(10, 21, '|' + '       ' + '|');
  // Row 11–12: pedestal stem
  put(11, 24, '|');
  put(12, 24, '|');
  // Row 13: feet
  putStr(13, 21, '\\' + '_______' + '/');

  // ── Candles and flames ─────────────────────────────────────

  // Flame characters — 3 phases for flicker
  const FLAME_CHARS = [
    ['^', 'Y', '^', 'Y', '^', 'Y', '^', 'Y', '^'],  // phase 0
    ['Y', '^', 'Y', '^', 'Y', '^', 'Y', '^', 'Y'],  // phase 1
    ['^', '^', 'Y', '^', '^', '^', 'Y', '^', '^'],  // phase 2 — subtle
  ];

  BRANCH_COLS.forEach((col, idx) => {
    const isShamash = idx === SHAMASH_IDX;
    const isLit     = litSet.has(idx);

    // Candle top nub (unlit = 'i', lit = flame char)
    if (isLit) {
      const flameChar = FLAME_CHARS[flickerPhase][idx];
      if (isShamash) {
        // Shamash gets two flame rows (taller, more prominent)
        put(1, col, ')');
        put(2, col, flameChar);
      } else {
        put(3, col, flameChar);
      }
    } else {
      // Unlit wick stub
      if (isShamash) {
        put(2, col, '.');
      } else {
        put(3, col, '.');
      }
    }

    // Candle wax body (small nub above the stem)
    if (isShamash) {
      // already drawn stem above
    } else {
      // outer candle stub row 4 — the wax top
      put(4, col, isLit ? '\'' : '`');
    }
  });

  return grid.map(r => r.join('')).join('\n');
}

function initMenorah(targetEl) {
  const pre = makeContainer('anim-menorah', 'green');
  targetEl.insertAdjacentElement('afterend', pre);

  const lit = new Set();
  let lightStep  = 0;
  let flickPhase = 0;
  let flickTimer = null;
  let lightTimer = null;

  // Render current state
  function render() {
    pre.textContent = buildMenorahGrid(lit, flickPhase);
  }

  // Phase 1: light candles one by one
  function lightNext() {
    if (lightStep < LIGHT_ORDER.length) {
      lit.add(LIGHT_ORDER[lightStep]);
      lightStep++;
      render();
      lightTimer = setTimeout(lightNext, 700);
    } else {
      // Phase 2: all lit — start flicker
      startFlicker();
    }
  }

  function startFlicker() {
    function flick() {
      flickPhase = (flickPhase + 1) % 3;
      render();
      flickTimer = setTimeout(flick, 140 + Math.random() * 60);
    }
    flick();
  }

  // Initial empty render, then begin lighting
  render();
  lightTimer = setTimeout(lightNext, 600);

  return () => { clearTimeout(lightTimer); clearTimeout(flickTimer); };
}


// ─────────────────────────────────────────────────────────────
// EXPORT / AUTO-INIT
// ─────────────────────────────────────────────────────────────
//
// index.html uses a typing engine that appends span.line elements
// progressively. Animations must be injected AFTER the typing engine
// finishes (or after the relevant line is typed).
//
// The cleanest integration is at the end of nextLine() when lineIndex
// has passed the relevant anchor line. Add `data-anim` attributes to
// the LINES entries you want to trigger animations, then check in nextLine():
//
//   // In LINES array — add data-anim markers:
//   { text: '─── THE FLAME ──────────────────────────────', cls: 'section', delay: 500, anim: 'flame' },
//   { text: 'It burned for eight.',  cls: 'amber', delay: 300, anim: 'menorah' },
//   { text: '─── WHO WE ARE ─────────────────────────────', cls: 'section', delay: 600, anim: 'hills' },
//
//   // In nextLine(), after createLine():
//   if (anim && window.hackabeeAnimations) {
//     const fn = { flame: initFlame, hills: initHills, menorah: initMenorah }[anim];
//     if (fn) fn(currentEl);
//   }
//
// Placement per concept:
//   A (Flame)   — inject BEFORE the '─── THE FLAME ───' section span
//                 → pass that span as targetEl; uses insertAdjacentElement('beforebegin')
//   B (Hills)   — inject AFTER the '─── WHO WE ARE ───' section span
//                 → pass that span as targetEl; uses insertAdjacentElement('afterend')
//   C (Menorah) — inject AFTER the 'It burned for eight.' amber span
//                 → pass that span as targetEl; uses insertAdjacentElement('afterend')
//
// DEV_MODE (?instant): animations still run — they don't depend on the
// typing engine, only on the DOM anchor element existing.

window.hackabeeAnimations = { initFlame, initHills, initMenorah };
