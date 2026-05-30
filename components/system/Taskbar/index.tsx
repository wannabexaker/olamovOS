import { memo, useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import {
  importAIButton,
  importAIChat,
  importCalendar,
  importSearch,
  importStartMenu,
  importVolumePanel,
} from "components/system/Taskbar/functions";
import Clock from "components/system/Taskbar/Clock";
import StartButton from "components/system/Taskbar/StartButton";
import StyledTaskbar from "components/system/Taskbar/StyledTaskbar";
import TaskbarEntries from "components/system/Taskbar/TaskbarEntries";
import VolumeButton from "components/system/Taskbar/Volume";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import { CLOCK_CANVAS_BASE_WIDTH, FOCUSABLE_ELEMENT } from "utils/constants";
import useGlobalVolume from "components/system/Taskbar/Volume/useGlobalVolume";
import { useWindowAI } from "hooks/useWindowAI";
import { useSession } from "contexts/session";

const AIButton = dynamic(importAIButton);
const AIChat = dynamic(importAIChat);
const Calendar = dynamic(importCalendar);
const Search = dynamic(importSearch);
const StartMenu = dynamic(importStartMenu);
const VolumePanel = dynamic(importVolumePanel);

const Taskbar: FC = () => {
  const [startMenuVisible, setStartMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [aiVisible, setAIVisible] = useState(false);
  const [volumeVisible, setVolumeVisible] = useState(false);
  const [clockWidth, setClockWidth] = useState(CLOCK_CANVAS_BASE_WIDTH);
  const { aiEnabled } = useSession();
  const hasWindowAI = useWindowAI();
  const toggleStartMenu = useCallback(
    (showMenu?: boolean): void =>
      setStartMenuVisible((currentMenuState) => showMenu ?? !currentMenuState),
    []
  );
  const toggleSearch = useCallback(
    (showSearch?: boolean): void =>
      setSearchVisible(
        (currentSearchState) => showSearch ?? !currentSearchState
      ),
    []
  );
  const toggleCalendar = useCallback(
    (showCalendar?: boolean): void =>
      setCalendarVisible(
        (currentCalendarState) => showCalendar ?? !currentCalendarState
      ),
    []
  );
  const toggleVolume = useCallback(
    (showVolume?: boolean): void =>
      setVolumeVisible(
        (currentVolumeState) => showVolume ?? !currentVolumeState
      ),
    []
  );
  const toggleAI = useCallback(
    (showAI?: boolean): void =>
      setAIVisible((currentAIState) => showAI ?? !currentAIState),
    []
  );
  const hasAI = hasWindowAI || aiEnabled;

  useGlobalVolume();

  useEffect(() => {
    const closeSearch = (): void => toggleSearch(false);

    window.addEventListener("olamov:close-search", closeSearch);

    return () => window.removeEventListener("olamov:close-search", closeSearch);
  }, [toggleSearch]);

  return (
    <>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {startMenuVisible && (
          <StartMenu
            key="startMenu"
            toggleSearch={toggleSearch}
            toggleStartMenu={toggleStartMenu}
          />
        )}
        {searchVisible && <Search key="search" toggleSearch={toggleSearch} />}
      </AnimatePresence>
      <StyledTaskbar {...useTaskbarContextMenu()} {...FOCUSABLE_ELEMENT}>
        <StartButton
          startMenuVisible={startMenuVisible}
          toggleStartMenu={toggleStartMenu}
        />
        <TaskbarEntries clockWidth={clockWidth} hasAI={hasAI} />
        <VolumeButton
          clockWidth={clockWidth}
          hasAI={hasAI}
          toggleVolume={toggleVolume}
        />
        <Clock
          hasAI={hasAI}
          setClockWidth={setClockWidth}
          toggleCalendar={toggleCalendar}
          width={clockWidth}
        />
        {hasAI && <AIButton aiVisible={aiVisible} toggleAI={toggleAI} />}
      </StyledTaskbar>
      <AnimatePresence initial={false} presenceAffectsLayout={false}>
        {calendarVisible && (
          <Calendar key="calendar" toggleCalendar={toggleCalendar} />
        )}
        {volumeVisible && (
          <VolumePanel
            key="volumePanel"
            clockWidth={clockWidth}
            hasAI={hasAI}
            toggleVolume={toggleVolume}
          />
        )}
        {aiVisible && <AIChat key="aiChat" toggleAI={toggleAI} />}
      </AnimatePresence>
    </>
  );
};

export default memo(Taskbar);
