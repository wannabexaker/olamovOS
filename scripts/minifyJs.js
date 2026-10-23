const { readdirSync, readFileSync, statSync, writeFileSync } = require("fs");
const { minify } = require("terser");
const { extname, join, normalize } = require("path");

const OUT_PATH = "out";

// Olamov: the desktop shell is a component shared by the home page and every
// SEO landing route, so webpack emits its startup worker (the taskbar clock)
// into a shared chunk instead of pages/index-*.js. Inline the worker in
// whichever of the home page's own initial chunks constructs it.
const SKIPPED_CHUNKS =
  /[\\/](?:webpack|framework|main|polyfills)-\w+\.js$|[\\/]pages[\\/]_app-\w+\.js$/;
const indexChunks = new Set(
  [
    ...readFileSync(join(OUT_PATH, "index.html"), "utf8").matchAll(
      /src="?\/(_next\/static\/chunks\/[^"\s>]+\.js)/g
    ),
  ]
    .map(([, src]) => normalize(join(OUT_PATH, src)))
    .filter((chunk) => !SKIPPED_CHUNKS.test(chunk))
);
let inlinedWorker = false;

const JS_MINIFIER_CONFIG = {
  compress: true,
  ecma: 2020,
  mangle: true,
  output: {
    comments: false,
  },
  sourceMap: false,
};

const workerRegEx =
  /new Worker\(\w+\.\w+\(new URL\(\w+\.\w+\+\w+\.\w+\(\d+\),\w+\.\w+\)\),\{name:"([\w\s]+)"\}\)/;

const inlineIndexWorkers = (code) => {
  const [, workerName] = code.match(workerRegEx) || [];

  if (workerName) {
    const workerFilename = readdirSync(
      join(OUT_PATH, "_next/static/chunks")
    ).find((entry) => entry.startsWith(`${workerName}.`));

    if (!workerFilename) {
      throw new Error(`Worker file not found for '${workerName}'`);
    }

    const workerSource = readFileSync(
      join(OUT_PATH, "_next/static/chunks", workerFilename)
    );

    return code.replace(
      workerRegEx,
      () =>
        `new Worker(URL.createObjectURL(new Blob([${JSON.stringify(
          workerSource.toString()
        )}],{type:"text/javascript"})),{name:"${workerName}"})`
    );
  }

  return code;
};

const minifyJsFiles = (path) =>
  Promise.all(
    readdirSync(path).map(async (entry) => {
      const fullPath = join(path, entry);
      const stats = statSync(fullPath);

      if (stats.isDirectory()) {
        await minifyJsFiles(fullPath);
      } else if (extname(entry).toLowerCase() === ".js") {
        const js = readFileSync(fullPath);
        let { code: minifiedJs, error } = await minify(
          js.toString(),
          JS_MINIFIER_CONFIG
        );

        if (!error && minifiedJs?.length > 0) {
          if (indexChunks.has(normalize(fullPath))) {
            const changedCode = inlineIndexWorkers(minifiedJs);

            if (changedCode !== minifiedJs) inlinedWorker = true;

            minifiedJs = changedCode;
          }

          writeFileSync(fullPath, minifiedJs);
        }
      }
    })
  );

minifyJsFiles(OUT_PATH).then(() => {
  // Still fail loudly if the worker pattern stops matching (e.g. bundler
  // output changes), exactly like the upstream per-file check did.
  if (!inlinedWorker) throw new Error("Inlining worker failed!");
});
