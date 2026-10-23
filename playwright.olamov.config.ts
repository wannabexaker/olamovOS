import { type PlaywrightTestConfig } from "@playwright/test";
import config from "playwright.config";

// Olamov OS runs upstream daedalOS's E2E suite unchanged, minus the tests that
// assert upstream UI this fork deliberately replaced. Kept out of the specs and
// playwright.config.ts so upstream syncs merge without conflicts. Re-check
// this list after every sync: drop entries that pass again, add new ones only
// for intentional divergences (never to hide a real bug).
type SkippedTest = [file: string, ...titlePath: string[]];

const SKIPPED_TESTS: SkippedTest[] = [
  // No taskbar search button: search opens from the Start Menu instead.
  [
    "accessibility.spec.ts",
    "desktop shell",
    "search menu is a labeled dialog with tabs",
  ],
  [
    "accessibility.spec.ts",
    "desktop shell",
    "search menu passes accessibility scan",
  ],
  [
    "accessibility.spec.ts",
    "desktop shell",
    "taskbar popup toggles are native buttons",
  ],
  [
    "focus.spec.ts",
    "popup focus management",
    "search focuses its input when opened and Escape closes it",
  ],
  [
    "focus.spec.ts",
    "popup focus management",
    "search menu closes when clicking the desktop",
  ],
  [
    "focus.spec.ts",
    "taskbar toggle buttons",
    "toggles carry the explicit tabindex WebKit needs for click focus",
  ],
  [
    "focus.spec.ts",
    "taskbar toggle buttons",
    "search menu closes on a second search button click",
  ],
  [
    "focus.spec.ts",
    "taskbar entries",
    "search menu closes when an entry is clicked",
  ],
  [
    "keyboard.spec.ts",
    "desktop",
    "taskbar buttons are navigable with arrow keys",
  ],
  [
    "keyboard.spec.ts",
    "desktop",
    "typing in a just opened start menu searches",
  ],
  [
    "keyboard.spec.ts",
    "desktop",
    "search suggestions are reachable with arrow keys",
  ],
  ["Search.spec.ts", "can close", "via button"],
  ["Search.spec.ts", "can search", "via 'All' tab"],
  // Start Menu has the Olamov brand band (no sidebar) and its own entries.
  ["StartMenu.spec.ts", "has sidebar", "has buttons"],
  ["StartMenu.spec.ts", "has sidebar", "can expand"],
  ["StartMenu.spec.ts", "has files", "has items"],
  ["StartMenu.spec.ts", "has files", "has context menu (read only)"],
  // Olamov window bevel border: a maximized window covers the screen, but its
  // clientWidth/clientHeight is 2px under the exact size these tests expect.
  [
    "Taskbar.spec.ts",
    "entries",
    "has entry",
    "has context menu",
    "can maximize & restore",
  ],
  ["Window.spec.ts", "can maximize", "via click button"],
  ["Window.spec.ts", "can maximize", "via double click titlebar"],
  [
    "Window.spec.ts",
    "can maximize",
    "stays on screen when the viewport shrinks",
  ],
  [
    "Window.spec.ts",
    "can maximize",
    "opens maximized when larger than the viewport",
  ],
  ["Window.spec.ts", "can maximize", "opens maximized from session"],
  // Olamov branding: icons, Terminal title, license banner, SEO head tags.
  ["FileExplorer.spec.ts", "can change page icon"],
  ["Taskbar.spec.ts", "entries", "has entry", "has icon"],
  ["Desktop.spec.ts", "has context menu", "can open terminal"],
  [
    "Desktop.spec.ts",
    "has keyboard shortcuts",
    "can open terminal (shift + f10)",
  ],
  ["Terminal.spec.ts", "has commands", "license"],
  ["Metadata.spec.ts", "has correct tags", "has link preloads"],
  ["Metadata.spec.ts", "has correct tags", "has open graphs"],
  // Olamov's default wallpaper is an image, which DEBUG_DISABLE_WALLPAPER does
  // not block. When it loads first, the new image correctly lands on the
  // --after-background layer, but this test only reads --before-background.
  ["Wallpaper.spec.ts", "can set background", "via image"],
];

const escapeRegExp = (text: string): string =>
  text.replace(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`);

// grep runs against "<project> <file path> <describe...> <title> <tags>", so
// match the file's basename through the full title, ending before any tags.
const toPattern = ([file, ...titlePath]: SkippedTest): RegExp =>
  new RegExp(`${escapeRegExp(`${file} ${titlePath.join(" ")}`)}(?: @|$)`);

const olamovConfig: PlaywrightTestConfig = {
  ...config,
  grepInvert: SKIPPED_TESTS.map(toPattern),
};

export default olamovConfig;
