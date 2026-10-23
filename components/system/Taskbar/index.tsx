import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Clock from "components/system/Taskbar/Clock";
import {
  importAIButton,
  importAIChat,
  importCalendar,
  importSearch,
  importStartMenu,
  importVolumePanel,
} from "components/system/Taskbar/functions";
import StartButton from "components/system/Taskbar/StartButton";
import StyledTaskbar from "components/system/Taskbar/StyledTaskbar";
import TaskbarEntries from "components/system/Taskbar/TaskbarEntries";
import useTaskbarContextMenu from "components/system/Taskbar/useTaskbarContextMenu";
import VolumeButton from "components/system/Taskbar/Volume";
import useGlobalVolume from "components/system/Taskbar/Volume/useGlobalVolume";
import { useShowAI } from "hooks/useWindowAI";
import { CLOCK_CANVAS_BASE_WIDTH, FOCUSABLE_ELEMENT } from "utils/constants";
import { haltEvent } from "utils/functions";
import { focusByKey } from "utils/keyboard";

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
  const hasAI = useShowAI();
  const toggleStartMenu = (showMenu?: boolean): void =>
    setStartMenuVisible((currentMenuState) => showMenu ?? !currentMenuState);
  const toggleSearch = (showSearch?: boolean): void =>
    setSearchVisible((currentSearchState) => showSearch ?? !currentSearchState);
  const toggleCalendar = (showCalendar?: boolean): void =>
    setCalendarVisible(
      (currentCalendarState) => showCalendar ?? !currentCalendarState
    );
  const toggleVolume = (showVolume?: boolean): void =>
    setVolumeVisible((currentVolumeState) => showVolume ?? !currentVolumeState);
  const toggleAI = (showAI?: boolean): void =>
    setAIVisible((currentAIState) => showAI ?? !currentAIState);

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
      <StyledTaskbar
        aria-label="Taskbar"
        onKeyDown={(event) => {
          if (
            focusByKey(
              event.key,
              [
                ...event.currentTarget.querySelectorAll<HTMLElement>(
                  ":scope > button, :scope > ol > li > button"
                ),
              ],
              { vertical: false }
            )
          ) {
            haltEvent(event);
          }
        }}
        {...useTaskbarContextMenu()}
        {...FOCUSABLE_ELEMENT}
      >
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
          calendarVisible={calendarVisible}
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

export default Taskbar;
