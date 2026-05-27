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

const copyRecursive = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });

  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "desktop.ini") continue;

    const fromPath = path.join(from, entry.name);
    const toPath = path.join(to, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  }
};

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
copyRecursive(SRC, DST);

console.log(`[syncStartMenuDocuments] synced ${SRC} -> ${DST}`);
