import { useEffect, useRef } from "react";
import { getProcessByFileExtension } from "components/system/Files/FileEntry/functions";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import processDirectory from "contexts/process/directory";
import { getExtension, getSearchParam } from "utils/functions";
import { getRouteByPath } from "utils/publicRoutes";

const isBrowserUrl = (url: string): boolean =>
  url.startsWith("http://") ||
  url.startsWith("https://") ||
  url.startsWith("chrome://");

const useUrlLoader = (): void => {
  const { exists, fs, stat } = useFileSystem();
  const { open } = useProcesses();
  const loadedInitialAppRef = useRef(false);

  useEffect(() => {
    if (loadedInitialAppRef.current || !fs || !exists || !open) return;

    loadedInitialAppRef.current = true;

    // Clean public routes (e.g. /apps/terminal, /gallery/bedroom, /games/doom)
    // resolve to the same app/url the legacy query params would have produced.
    const route = getRouteByPath(window.location.pathname);
    const app = route?.app || getSearchParam("app");
    const url = route?.url || getSearchParam("url");

    const loadInitialApp = async (initialApp: string): Promise<void> => {
      if (!initialApp) return;

      let urlExists = false;

      try {
        urlExists =
          (initialApp === "Browser" && isBrowserUrl(url)) ||
          (await exists(url));
      } catch {
        // Ignore error checking if url exists
      }

      if (initialApp === "FileExplorer" && url && !urlExists) return;

      open(initialApp, urlExists ? { url } : undefined);
    };

    if (app) {
      const lcAppNames = Object.fromEntries(
        Object.entries(processDirectory)
          .filter(([, { dialogProcess }]) => !dialogProcess)
          .map(([name]) => [name.toLowerCase(), name])
      );

      loadInitialApp(lcAppNames[app.toLowerCase()]);
    } else if (url) {
      if (isBrowserUrl(url)) {
        loadInitialApp("Browser");
      } else {
        try {
          stat(url).then((stats) =>
            loadInitialApp(
              stats.isDirectory()
                ? "FileExplorer"
                : getProcessByFileExtension(getExtension(url))
            )
          );
        } catch {
          // Ignore error getting url
        }
      }
    }
  }, [exists, fs, open, stat]);
};

export default useUrlLoader;
