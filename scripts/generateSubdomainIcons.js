// One-off generator for the external subdomain-app icons.
// Purple "app tile" chassis (matches olamov-stream) + a per-app glyph, rendered
// to /public/System/Icons/<name>.png (48) and the 16/32/48/96/144 variants.
const { mkdirSync, writeFileSync } = require("fs");
const { join } = require("path");
const sharp = require("sharp");

const OUT = "public/System/Icons";
const SIZES = [16, 32, 48, 96, 144];
const BASE = 48;

const TILE_AND_GLOSS = `
  <defs>
    <clipPath id="clip"><rect x="24" y="24" width="464" height="464" rx="104"/></clipPath>
    <linearGradient id="tile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#8a2be2"/>
      <stop offset="0.55" stop-color="#5b17b0"/>
      <stop offset="1" stop-color="#360a70"/>
    </linearGradient>
    <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>`;

const wrap = (extraDefs, glyph) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    ${TILE_AND_GLOSS}
    ${extraDefs || ""}
    <g clip-path="url(#clip)">
      <rect x="24" y="24" width="464" height="464" fill="url(#tile)"/>
      <rect x="24" y="24" width="464" height="230" fill="url(#gloss)"/>
      ${glyph}
    </g>
    <rect x="24" y="24" width="464" height="464" rx="104" fill="none" stroke="#cc00ff" stroke-opacity="0.55" stroke-width="8"/>
    <rect x="28" y="28" width="456" height="456" rx="100" fill="none" stroke="#1a0033" stroke-opacity="0.5" stroke-width="3"/>
  </svg>`;

// --- Radevu: calendar + check ---
const radevu = wrap(
  "",
  `<rect x="196" y="150" width="18" height="42" rx="9" fill="#c9b3f0"/>
   <rect x="298" y="150" width="18" height="42" rx="9" fill="#c9b3f0"/>
   <rect x="150" y="176" width="212" height="186" rx="26" fill="#f3ecff"/>
   <path d="M150,234 L150,202 Q150,176 176,176 L336,176 Q362,176 362,202 L362,234 Z" fill="#cc00ff"/>
   <path d="M196,298 L236,338 L322,246" fill="none" stroke="#6a0dad" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>`
);

// --- The Eye in the Sky: gold all-seeing eye + sunburst rays ---
const cx = 256;
const cy = 262;
let rays = "";
for (let i = 0; i < 8; i += 1) {
  const a = (Math.PI / 4) * i - Math.PI / 2;
  const x1 = (cx + Math.cos(a) * 198).toFixed(1);
  const y1 = (cy + Math.sin(a) * 198).toFixed(1);
  const x2 = (cx + Math.cos(a) * 236).toFixed(1);
  const y2 = (cy + Math.sin(a) * 236).toFixed(1);
  rays += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#gold)" stroke-width="12" stroke-linecap="round"/>`;
}
const eye = wrap(
  `<defs>
     <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0" stop-color="#ffe9a8"/><stop offset="1" stop-color="#f0a500"/>
     </linearGradient>
     <radialGradient id="iris" cx="0.5" cy="0.5" r="0.5">
       <stop offset="0" stop-color="#9b5cff"/><stop offset="0.6" stop-color="#6600cc"/><stop offset="1" stop-color="#2a0a5e"/>
     </radialGradient>
     <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
       <stop offset="0" stop-color="#ffcf3f" stop-opacity="0.45"/><stop offset="1" stop-color="#ffcf3f" stop-opacity="0"/>
     </radialGradient>
   </defs>`,
  `<circle cx="256" cy="262" r="184" fill="url(#glow)"/>
   ${rays}
   <path d="M120,262 Q256,150 392,262 Q256,374 120,262 Z" fill="#fff6da" stroke="url(#gold)" stroke-width="14" stroke-linejoin="round"/>
   <circle cx="256" cy="262" r="66" fill="url(#iris)"/>
   <circle cx="256" cy="262" r="30" fill="#140a2e"/>
   <circle cx="236" cy="242" r="13" fill="#ffffff" fill-opacity="0.9"/>`
);

// --- VC Hub: synthwave sliced sun (Vice City) ---
const vchub = wrap(
  `<defs>
     <linearGradient id="sun" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0" stop-color="#ff5fa2"/><stop offset="0.5" stop-color="#ff2d95"/><stop offset="1" stop-color="#ffd23f"/>
     </linearGradient>
     <clipPath id="sunclip"><circle cx="256" cy="242" r="132"/></clipPath>
   </defs>`,
  `<circle cx="256" cy="242" r="132" fill="url(#sun)"/>
   <g clip-path="url(#sunclip)">
     <rect x="110" y="296" width="292" height="9" fill="#360a70"/>
     <rect x="110" y="320" width="292" height="12" fill="#360a70"/>
     <rect x="110" y="348" width="292" height="16" fill="#360a70"/>
     <rect x="110" y="380" width="292" height="24" fill="#360a70"/>
   </g>
   <rect x="86" y="410" width="340" height="7" rx="3.5" fill="#ff2d95"/>`
);

// --- Cypher: retro microphone ---
const cypher = wrap(
  `<defs>
     <linearGradient id="mic" x1="0" y1="0" x2="0" y2="1">
       <stop offset="0" stop-color="#efe6ff"/><stop offset="1" stop-color="#b59cdc"/>
     </linearGradient>
     <radialGradient id="micglow" cx="0.5" cy="0.5" r="0.5">
       <stop offset="0" stop-color="#cc00ff" stop-opacity="0.38"/><stop offset="1" stop-color="#cc00ff" stop-opacity="0"/>
     </radialGradient>
     <clipPath id="headclip"><rect x="206" y="138" width="100" height="172" rx="50"/></clipPath>
   </defs>`,
  `<circle cx="256" cy="236" r="152" fill="url(#micglow)"/>
   <path d="M188,266 Q188,362 256,362 Q324,362 324,266" fill="none" stroke="#b59cdc" stroke-width="18" stroke-linecap="round"/>
   <rect x="248" y="356" width="16" height="44" rx="6" fill="#b59cdc"/>
   <rect x="212" y="398" width="88" height="16" rx="8" fill="#b59cdc"/>
   <rect x="206" y="138" width="100" height="172" rx="50" fill="url(#mic)"/>
   <g clip-path="url(#headclip)">
     <rect x="206" y="174" width="100" height="8" fill="#6a0dad" fill-opacity="0.6"/>
     <rect x="206" y="204" width="100" height="8" fill="#6a0dad" fill-opacity="0.6"/>
     <rect x="206" y="234" width="100" height="8" fill="#6a0dad" fill-opacity="0.6"/>
     <rect x="206" y="264" width="100" height="8" fill="#6a0dad" fill-opacity="0.6"/>
   </g>`
);

// --- My Projects: 2x2 grid of the four project accent colors ---
const projects = wrap(
  "",
  `<rect x="150" y="150" width="96" height="96" rx="20" fill="#cc00ff"/>
   <rect x="266" y="150" width="96" height="96" rx="20" fill="#f7b500"/>
   <rect x="150" y="266" width="96" height="96" rx="20" fill="#ff2d95"/>
   <rect x="266" y="266" width="96" height="96" rx="20" fill="#c9b3f0"/>`
);

const icons = {
  "olamov-cypher": cypher,
  "olamov-eye": eye,
  "olamov-projects": projects,
  "olamov-radevu": radevu,
  "olamov-vchub": vchub,
};

const run = async () => {
  for (const [name, svg] of Object.entries(icons)) {
    const buffer = Buffer.from(svg);

    // eslint-disable-next-line no-await-in-loop
    await sharp(buffer)
      .resize(BASE, BASE)
      .png()
      .toFile(join(OUT, `${name}.png`));

    for (const size of SIZES) {
      const dir = join(OUT, `${size}x${size}`);

      mkdirSync(dir, { recursive: true });
      // eslint-disable-next-line no-await-in-loop
      await sharp(buffer)
        .resize(size, size)
        .png()
        .toFile(join(dir, `${name}.png`));
    }

    // Keep the source SVG for future tweaks.
    writeFileSync(join(OUT, `${name}.svg`), svg);
    process.stdout.write(`wrote ${name} (base + ${SIZES.join(",")})\n`);
  }
};

run().catch((error) => {
  process.stderr.write(`${error}\n`);
  process.exit(1);
});
