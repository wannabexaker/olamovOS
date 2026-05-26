import { expect, test } from "@playwright/test";
import { WINDOW_TITLEBAR_SELECTOR } from "e2e/constants";
import {
  captureConsoleLogs,
  disableWallpaper,
  loadApp,
  windowsAreVisible,
} from "e2e/functions";

const APP = "V86";
const DISK_IMAGE = "linux.bin";
const DISK_IMAGE_URL = `/System/${DISK_IMAGE}`;

test.beforeEach(captureConsoleLogs("apps"));
test.beforeEach(disableWallpaper);

test.describe("loads disk image", () => {
  for (const deviceMemory of [0.25, 8, 32]) {
    test(`with deviceMemory of ${deviceMemory} GB`, async ({ page }) => {
      await page.addInitScript((memory) => {
        Object.defineProperty(navigator, "deviceMemory", {
          configurable: true,
          get: () => memory,
        });
      }, deviceMemory);

      await loadApp({ app: APP, url: DISK_IMAGE_URL })({ page });
      await windowsAreVisible({ page });

      await expect(page.locator(WINDOW_TITLEBAR_SELECTOR)).toContainText(
        `Virtual x86 - ${DISK_IMAGE}`
      );
    });
  }
});
