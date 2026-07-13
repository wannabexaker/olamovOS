import { basename, extname } from "path";
import { useCallback, useEffect, useRef } from "react";
import { type ContainerHookProps } from "components/system/Apps/AppContainer";
import { patchAudioContextForWindow } from "components/system/Taskbar/Volume/audioContextPatch";
import useTitle from "components/system/Window/useTitle";
import { useProcesses } from "contexts/process";
import { useFileSystem } from "contexts/fileSystem";
import { bufferToUrl, loadFiles } from "utils/functions";
import useIsolatedContentWindow from "hooks/useIsolatedContentWindow";

// Commodore 64 isn't part of the locally hosted EmulatorJs build, so this app
// loads EmulatorJS (with the VICE core) from the CDN. It reuses daedalOS's
// isolated content window (the same one the Emulator app uses), which is what
// gives it working keyboard/focus handling. The CDN build's "start-game" event
// has a different signature than the local build, so the start handler must not
// rely on the event argument.
const CORE = "c64";
const DATA_PATH = "https://cdn.emulatorjs.org/stable/data/";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const withWindowConstructor = <F extends Function>(
  fn: F,
  context: Window
): F => {
  if ("Function" in context) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, no-param-reassign
    fn.constructor = context.Function as Function;
  }

  return fn;
};

const useCommodore64 = ({
  containerRef,
  id,
  setLoading,
  url,
}: ContainerHookProps): void => {
  const { readFile } = useFileSystem();
  const { linkElement, processes: { [id]: { libs = [] } = {} } = {} } =
    useProcesses();
  const { prependFileToTitle } = useTitle(id);
  const getContentWindow = useIsolatedContentWindow(id, containerRef);
  const loadedUrl = useRef<string>(undefined);
  const loadRom = useCallback(
    async (fileUrl: string) => {
      const contentWindow = getContentWindow?.();

      if (!contentWindow) return;

      loadedUrl.current = fileUrl;

      setLoading(true);

      containerRef.current?.classList.remove("drop");

      try {
        contentWindow.EJS_terminate?.();
      } catch {
        // Ignore errors during termination
      }

      [...contentWindow.document.body.children].forEach((child) =>
        child.remove()
      );
      const div = contentWindow.document.createElement("div");

      div.id = "emulator";
      div.style.placeContent = "center";
      contentWindow.document.body.append(div);

      // EmulatorJS creates its own AudioContext inside this isolated window, so
      // the main-window volume bridge never reaches it. Patch this window's
      // AudioContext before the emulator boots so the taskbar volume slider
      // controls the game's sound (routes it through the shared master gain).
      patchAudioContextForWindow(contentWindow);

      const gameName = basename(fileUrl, extname(fileUrl));
      const rom = await readFile(fileUrl);

      contentWindow.EJS_gameName = gameName;
      contentWindow.EJS_gameUrl = bufferToUrl(rom);
      contentWindow.EJS_core = CORE;
      contentWindow.EJS_player = "#emulator";
      contentWindow.EJS_biosUrl = "";
      contentWindow.EJS_pathtodata = DATA_PATH;
      contentWindow.EJS_startOnLoaded = true;
      contentWindow.EJS_RESET_VARS = true;
      // Start at full internal volume; the shared master gain (updated by the
      // taskbar slider) is the single point that scales the final output.
      contentWindow.EJS_volume = 1;
      contentWindow.EJS_Buttons = {
        cacheManage: false,
        loadState: false,
        quickLoad: false,
        quickSave: false,
        saveState: false,
        screenRecord: false,
        screenshot: false,
      };
      contentWindow.EJS_onGameStart = withWindowConstructor(() => {
        setLoading(false);

        const canvas = contentWindow.document.querySelector("canvas");

        if (canvas) linkElement(id, "peekElement", canvas);
      }, contentWindow);

      await loadFiles(libs, undefined, undefined, undefined, contentWindow);

      prependFileToTitle(`${gameName} (Commodore 64)`);
    },
    [
      containerRef,
      getContentWindow,
      id,
      libs,
      linkElement,
      prependFileToTitle,
      readFile,
      setLoading,
    ]
  );

  useEffect(() => {
    if (url) {
      if (url !== loadedUrl.current) loadRom(url);
    } else {
      setLoading(false);
      containerRef.current?.classList.add("drop");
    }
  }, [containerRef, loadRom, setLoading, url]);
};

export default useCommodore64;
