import { useEffect, useRef, useState } from "react";
import { useTheme } from "styled-components";
import { Search as SearchIcon } from "components/apps/FileExplorer/NavigationIcons";
import FileManager from "components/system/Files/FileManager";
import StyledStartMenu from "components/system/StartMenu/StyledStartMenu";
import {
  maybeCloseTaskbarMenu,
  SEARCH_BUTTON_TITLE,
  START_BUTTON_TITLE,
} from "components/system/Taskbar/functions";
import { updateInputValueOnReactElement } from "components/system/Taskbar/Search/functions";
import useTaskbarItemTransition from "components/system/Taskbar/useTaskbarItemTransition";
import {
  FOCUSABLE_ELEMENT,
  PREVENT_SCROLL,
  START_MENU_PATH,
  THIN_SCROLLBAR_WIDTH,
  THIN_SCROLLBAR_WIDTH_NON_WEBKIT,
} from "utils/constants";
import { haltEvent } from "utils/functions";
import {
  focusByCharacter,
  focusByKey,
  isKeyboardNavigating,
  isPrintableKey,
  isVisibleElement,
  restoreFocus,
} from "utils/keyboard";

type StartMenuProps = {
  // Olamov: the taskbar has no search button (Win98 layout), so search is
  // opened through the Taskbar's own toggle instead of clicking a nav button.
  toggleSearch: (showSearch?: boolean) => void;
  toggleStartMenu: (showMenu?: boolean) => void;
};

const getEntries = (list?: Element | null): HTMLButtonElement[] =>
  [...(list?.querySelectorAll<HTMLButtonElement>("li > button") || [])].filter(
    isVisibleElement
  );

const StartMenu: FC<StartMenuProps> = ({ toggleSearch, toggleStartMenu }) => {
  const menuRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const closingRef = useRef(false);
  const {
    sizes: { startMenu },
  } = useTheme();
  const [showScrolling, setShowScrolling] = useState(false);
  // eslint-disable-next-line react/hook-use-state
  const [canCustomizeScrollbarWidth] = useState(() =>
    CSS.supports("selector(::-webkit-scrollbar)")
  );
  const startMenuWidth =
    startMenu.size -
    (canCustomizeScrollbarWidth
      ? THIN_SCROLLBAR_WIDTH
      : THIN_SCROLLBAR_WIDTH_NON_WEBKIT);
  const revealScrolling: React.MouseEventHandler = ({ clientX = 0 }) =>
    setShowScrolling(clientX > startMenuWidth);
  const focusOnRenderCallback = (element: HTMLElement | null): void => {
    if (element && !element.contains(document.activeElement)) {
      returnFocusRef.current = document.activeElement;
    }

    element?.focus(PREVENT_SCROLL);
    menuRef.current = element;
  };
  const openSearch = (key?: string): void => {
    toggleStartMenu(false);
    toggleSearch(true);

    if (!key) return;

    let tries = 0;
    const openSearchTimerRef = window.setInterval(() => {
      const searchInput = document.querySelector<HTMLInputElement>(
        "#searchMenu .search > input"
      );

      if (searchInput) {
        updateInputValueOnReactElement(searchInput, key);
      }

      if (searchInput || (tries += 1) > 10) {
        window.clearInterval(openSearchTimerRef);
      }
    }, 50);
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLElement> = (event) => {
    const { key, target } = event;
    const menuElement = menuRef.current;
    const appList = menuElement?.querySelector(":scope > ol");
    // Arrows, Home & End on the menu itself go to its apps
    const list =
      target === menuElement
        ? appList
        : (target as Element).closest("#startMenu > nav, #startMenu > ol");
    const isPrintable = isPrintableKey(event);

    if (key === "Escape") {
      event.preventDefault();
      closingRef.current = true;
      toggleStartMenu(false);
      restoreFocus(returnFocusRef.current, menuElement);
      closingRef.current = false;
    } else if (
      list &&
      (focusByKey(key, getEntries(list), { horizontal: false }) ||
        // Like Windows, a letter jumps through the apps while navigating them
        (appList?.contains(target as Node) &&
          isPrintable &&
          isKeyboardNavigating() &&
          focusByCharacter(key, getEntries(list))))
    ) {
      haltEvent(event);
    } else if (isPrintable) openSearch(key);
  };
  const startMenuTransition = useTaskbarItemTransition(startMenu.maxHeight);

  // Olamov: the Shut Down dialog asks the Start Menu to close itself.
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
      aria-label="Start"
      id="startMenu"
      onBlurCapture={(event) => {
        if (!closingRef.current) {
          maybeCloseTaskbarMenu(
            event,
            menuRef.current,
            toggleStartMenu,
            undefined,
            START_BUTTON_TITLE
          );
        }
      }}
      onKeyDown={onKeyDown}
      onMouseLeave={() => setShowScrolling(false)}
      onMouseMove={revealScrolling}
      role="dialog"
      {...startMenuTransition}
      {...FOCUSABLE_ELEMENT}
    >
      <aside aria-hidden="true" className="brand-band">
        <strong>Olamov</strong> 1994 <strong>Universe</strong>
      </aside>
      <FileManager
        pinToBottom={["Run...", "Shut Down..."]}
        url={START_MENU_PATH}
        hideLoading
        hideShortcutIcons
        isStartMenu
        loadIconsImmediately
        readOnly
        skipFsWatcher
        skipSorting
      />
      <button
        className="search-trigger"
        onClick={() => openSearch()}
        title={SEARCH_BUTTON_TITLE}
        type="button"
      >
        <SearchIcon />
        Search
      </button>
    </StyledStartMenu>
  );
};

export default StartMenu;
