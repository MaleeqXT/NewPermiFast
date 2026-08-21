/**
 * QRCode
 * -------
 * Renders a *visually realistic* QR code as inline SVG.
 *
 * It is NOT a scannable QR code (encoding the real QR data
 * would require a full encoder). It draws all the structural
 * elements a real QR has — three finder patterns, one
 * alignment pattern, timing lines and a pseudo-random data
 * matrix seeded from the `seed` prop so each school gets a
 * different-but-stable look.
 */

const SIZE = 25; // number of modules per side (~ QR version 2 layout)

// Deterministic PRNG (mulberry32) — same seed → same QR pattern
function makeRng(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(value) {
  const str = String(value ?? "qr");
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Stamp a square block onto the grid at (cx, cy)
function stampFinder(grid, cx, cy) {
  // 7×7 finder pattern: outer black ring, white gap, inner 3×3 black
  for (let dy = 0; dy < 7; dy++) {
    for (let dx = 0; dx < 7; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
      const onEdge = dx === 0 || dy === 0 || dx === 6 || dy === 6;
      const inner = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
      grid[y][x] = onEdge || inner ? 1 : 0;
      // 2 = reserved (so random fill skips it)
      // we use 1 for black / 0 for white / -1 for reserved-white
    }
  }
  // Reserve the 1-module quiet zone around the finder
  for (let dy = -1; dy <= 7; dy++) {
    for (let dx = -1; dx <= 7; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
      if (grid[y][x] === null) grid[y][x] = 0; // reserved white
    }
  }
}

function stampAlignment(grid, cx, cy) {
  // 5×5 alignment: outer black ring, white gap, center black
  for (let dy = 0; dy < 5; dy++) {
    for (let dx = 0; dx < 5; dx++) {
      const x = cx + dx;
      const y = cy + dy;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
      const onEdge = dx === 0 || dy === 0 || dx === 4 || dy === 4;
      const center = dx === 2 && dy === 2;
      grid[y][x] = onEdge || center ? 1 : 0;
    }
  }
}

function buildGrid(seed) {
  const rng = makeRng(seed);
  const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

  // 1) Three finder patterns (top-left, top-right, bottom-left)
  stampFinder(grid, 0, 0);
  stampFinder(grid, SIZE - 7, 0);
  stampFinder(grid, 0, SIZE - 7);

  // 2) One alignment pattern near the bottom-right
  stampAlignment(grid, SIZE - 9, SIZE - 9);

  // 3) Timing patterns (row 6 and column 6) — alternating black/white
  for (let i = 8; i < SIZE - 8; i++) {
    if (grid[6][i] === null) grid[6][i] = i % 2 === 0 ? 1 : 0;
    if (grid[i][6] === null) grid[i][6] = i % 2 === 0 ? 1 : 0;
  }

  // 4) Fill remaining cells with pseudo-random data (~48% black is typical)
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === null) {
        grid[y][x] = rng() < 0.48 ? 1 : 0;
      }
    }
  }

  return grid;
}

export default function QRCode({
  seed = "permifast",
  size = 140,
  className,
  background = "#ffffff",
  foreground = "#0b0b0b",
  quietZone = 2, // modules of white padding around the code
}) {
  const grid = buildGrid(hashSeed(seed));
  const total = SIZE + quietZone * 2;
  const cells = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (grid[y][x] === 1) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x + quietZone}
            y={y + quietZone}
            width={1}
            height={1}
            // tiny overlap removes hairline gaps when scaled
            shapeRendering="crispEdges"
          />
        );
      }
    }
  }

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      role="img"
      aria-label="QR code"
    >
      <rect width={total} height={total} fill={background} />
      <g fill={foreground}>{cells}</g>
    </svg>
  );
}
