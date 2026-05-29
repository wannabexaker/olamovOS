"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public", "Users", "Public", "Documents");
const DST = path.join(
  ROOT,
  "public",
  "Users",
  "Public",
  "Start Menu",
  "Documents"
);

// Recursive copy. Only the top-level desktop.ini is preserved from the
// destination (Start Menu/Documents has its own folder icon), so we skip
// copying the source's top-level desktop.ini. Nested desktop.ini files (e.g.
// inside Blog Posts/, DOS Bundles/) carry the subfolder icons and must be
// copied along with the rest of the contents.
const copyRecursive = (from, to, isRoot = false) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (isRoot && entry.name === "desktop.ini") continue;

    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(fromPath, toPath, false);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
};

// Wipe everything in the destination except the destination's own
// desktop.ini, which gives the Start Menu/Documents folder its own icon.
const cleanCopiedContents = (dir) => {
  if (!fs.existsSync(dir)) return;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "desktop.ini") continue;

    const target = path.join(dir, entry.name);

    if (entry.isDirectory())
      fs.rmSync(target, { recursive: true, force: true });
    else fs.unlinkSync(target);
  }
};

cleanCopiedContents(DST);
copyRecursive(SRC, DST, true);

console.log(`[syncStartMenuDocuments] synced ${SRC} -> ${DST}`);
