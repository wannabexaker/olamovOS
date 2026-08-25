// Generates 1200x630 social share cards (og:image) for each project route.
// One purple Olamov-branded template + the project's own icon, so a shared
// link shows the project instead of the generic desktop screenshot.
const { readFileSync, mkdirSync } = require("fs");
const { join } = require("path");
const sharp = require("sharp");

const OUT_DIR = "public/System/OG";
const ICON_DIR = "public/System/Icons/144x144";

const CARDS = [
  {
    icon: "olamov-radevu.png",
    name: "Radevu",
    slug: "radevu",
    tagline: "Appointment booking SaaS",
  },
  {
    icon: "olamov-eye.png",
    name: "The Eye in the Sky",
    slug: "eye",
    tagline: "Cluster-pays slot game",
  },
  {
    icon: "olamov-vchub.png",
    name: "VC Hub",
    slug: "vc-hub",
    tagline: "GTA VI prices, stats & value",
  },
  {
    icon: "olamov-cypher.png",
    name: "Cypher",
    slug: "cypher",
    tagline: "Rap battle & live voting",
  },
  {
    icon: "olamov-projects.png",
    name: "My Projects",
    slug: "my-projects",
    tagline: "Everything I've built, inside Olamov OS",
  },
];

const escapeXml = (value) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FONT = "Segoe UI, Tahoma, Verdana, sans-serif";

const card = (name, tagline) => `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a0f33"/>
      <stop offset="0.55" stop-color="#2a1257"/>
      <stop offset="1" stop-color="#0d0720"/>
    </linearGradient>
    <linearGradient id="rule" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#cc00ff"/>
      <stop offset="1" stop-color="#6600cc" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1035" cy="128" r="230" fill="#6600cc" fill-opacity="0.16"/>
  <circle cx="150" cy="560" r="180" fill="#cc00ff" fill-opacity="0.10"/>
  <rect x="90" y="404" width="420" height="5" rx="2.5" fill="url(#rule)"/>
  <text x="90" y="360" font-family="${FONT}" font-size="76" font-weight="700" fill="#f3ecff">${escapeXml(
    name
  )}</text>
  <text x="90" y="462" font-family="${FONT}" font-size="34" fill="#b7a6dd">${escapeXml(
    tagline
  )}</text>
  <text x="90" y="556" font-family="${FONT}" font-size="27" font-weight="600" fill="#cc00ff" letter-spacing="1.5">olamov.com</text>
</svg>`;

const run = async () => {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const { icon, name, slug, tagline } of CARDS) {
    const background = Buffer.from(card(name, tagline));
    // eslint-disable-next-line no-await-in-loop
    const iconBuffer = await sharp(readFileSync(join(ICON_DIR, icon)))
      .resize(200, 200)
      .toBuffer();

    // eslint-disable-next-line no-await-in-loop
    await sharp(background)
      .composite([{ input: iconBuffer, left: 856, top: 215 }])
      .png()
      .toFile(join(OUT_DIR, `${slug}.png`));

    process.stdout.write(`wrote ${slug}.png\n`);
  }
};

run().catch((error) => {
  process.stderr.write(`${error}\n`);
  process.exit(1);
});
