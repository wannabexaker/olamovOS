import { useTheme } from "styled-components";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import FileManager from "components/system/Files/FileManager";
import StyledStartMenu from "components/system/StartMenu/StyledStartMenu";
import { updateInputValueOnReactElement } from "components/system/Taskbar/Search/functions";
import {
  SEARCH_BUTTON_TITLE,
  START_BUTTON_TITLE,
  maybeCloseTaskbarMenu,
} from "components/system/Taskbar/functions";
import useTaskbarItemTransition from "components/system/Taskbar/useTaskbarItemTransition";
import {
  FOCUSABLE_ELEMENT,
  PREVENT_SCROLL,
  START_MENU_PATH,
  THIN_SCROLLBAR_WIDTH,
  THIN_SCROLLBAR_WIDTH_NON_WEBKIT,
} from "utils/constants";
import { getNavButtonByTitle } from "hooks/useGlobalKeyboardShortcuts";

type StartMenuProps = {
  toggleStartMenu: (showMenu?: boolean) => void;
};

const StartMenu: FC<StartMenuProps> = ({ toggleStartMenu }) => {
  const menuRef = useRef<HTMLElement | null>(null);
  const {
    sizes: { startMenu },
  } = useTheme();
  const [showScrolling, setShowScrolling] = useState(false);
  const canCustomizeScrollbarWidth = useMemo(
    () => CSS.supports("selector(::-webkit-scrollbar)"),
    []
  );
  const startMenuWidth = useMemo(
    () =>
      startMenu.size -
      (canCustomizeScrollbarWidth
        ? THIN_SCROLLBAR_WIDTH
        : THIN_SCROLLBAR_WIDTH_NON_WEBKIT),
    [canCustomizeScrollbarWidth, startMenu.size]
  );
  const revealScrolling: React.MouseEventHandler = useCallback(
    ({ clientX = 0 }) => setShowScrolling(clientX > startMenuWidth),
    [startMenuWidth]
  );
  const focusOnRenderCallback = useCallback((element: HTMLElement | null) => {
    element?.focus(PREVENT_SCROLL);
    menuRef.current = element;
  }, []);
  const startMenuTransition = useTaskbarItemTransition(startMenu.maxHeight);

  useEffect(() => {
    const closeStartMenu = (): void => toggleStartMenu(false);

    window.addEventListener("olamov:close-start-menu", closeStartMenu);

    return () =>
      window.removeEventListener("olamov:close-start-menu", closeStartMenu);
  }, [toggleStartMenu]);

  return (
    <StyledStartMenu
      ref={focusOnRenderCallback}
      $showScrolling={showScrolling}
      id="startMenu"
      onBlurCapture={(event) =>
        maybeCloseTaskbarMenu(
          event,
          menuRef.current,
          toggleStartMenu,
          undefined,
          START_BUTTON_TITLE
        )
      }
      onKeyDown={({ key }) => {
        if (key === "Escape") toggleStartMenu(false);
        else if (key.length === 1) {
          toggleStartMenu(false);

          const searchButton = getNavButtonByTitle(SEARCH_BUTTON_TITLE);

          if (searchButton) {
            searchButton.click();

            let tries = 0;
            const openSearchTimerRef = window.setInterval(() => {
              const searchInput = document.querySelector<HTMLInputElement>(
                "main > nav .search > input"
              );

              if (searchInput) {
                updateInputValueOnReactElement(searchInput, key);
              }

              if (searchInput || ++tries > 10) {
                window.clearInterval(openSearchTimerRef);
              }
            }, 50);
          }
        }
      }}
      onMouseLeave={() => setShowScrolling(false)}
      onMouseMove={revealScrolling}
      {...startMenuTransition}
      {...FOCUSABLE_ELEMENT}
    >
      <FileManager
        url={START_MENU_PATH}
        hideLoading
        hideShortcutIcons
        isStartMenu
        loadIconsImmediately
        readOnly
        skipFsWatcher
        skipSorting
      />
    </StyledStartMenu>
  );
};

export default memo(StartMenu);
