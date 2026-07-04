const { existsSync, statSync, writeFileSync } = require("fs");
const { join } = require("path");
const { author } = require("../package.json");
const routes = require("../utils/seoRoutes.json");

const tzOffsetMs = new Date().getTimezoneOffset() * 60000;
const toIsoDate = (ms) =>
  new Date(ms - tzOffsetMs).toISOString().substring(0, 10);
const today = toIsoDate(Date.now());

// lastmod from the backing public file when there is one, else the build date.
const lastModFor = (route) => {
  if (route.url) {
    const filePath = join("public", route.url);

    if (existsSync(filePath)) {
      return toIsoDate(statSync(filePath).mtime.getTime());
    }
  }

  return today;
};

const urlEntry = (route) => {
  const loc = `${author.url}${route.path}`;
  const lastmod = lastModFor(route);

  if (route.image && route.url) {
    const imageLoc = `${author.url}/${encodeURI(route.url)}`;

    return `<url><loc>${loc}</loc><image:image><image:loc>${imageLoc}</image:loc></image:image><lastmod>${lastmod}</lastmod></url>`;
  }

  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`;
};

writeFileSync(
  "public/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${routes
    .map(urlEntry)
    .join("")}</urlset>`,
  { flag: "w" }
);

// NOTE: ?app= / ?url= are intentionally NOT disallowed. Those legacy URLs are
// de-indexed via client-side noindex + canonical -> clean route, which only
// works if crawlers are allowed to fetch and SEE those tags. Blocking them in
// robots would freeze already-indexed ones as "indexed though blocked".
// Only pure tracking params, source maps and raw JSON data files are blocked.
// CSS/JS/fonts/images stay open so crawlers can render. AI crawlers are allowed.
const robotsTxt = [
  "User-agent: *",
  "Allow: /",
  "",
  "Disallow: /*?utm_",
  "Disallow: /*?ref=",
  "Disallow: /*?source=",
  "Disallow: /*?debug=",
  "Disallow: /*?preview=",
  "Disallow: /*?dev=",
  "Disallow: /*?state=",
  "Disallow: /*.json$",
  "Disallow: /*.map$",
  "",
  `Sitemap: ${author.url}/sitemap.xml`,
  "",
].join("\n");

writeFileSync("public/robots.txt", robotsTxt, { flag: "w" });
