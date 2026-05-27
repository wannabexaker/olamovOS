import styled from "styled-components";
import { m as motion } from "motion/react";
import StyledFileEntry from "components/system/Files/Views/List/StyledFileEntry";
import StyledFileManager from "components/system/Files/Views/List/StyledFileManager";
import TaskbarPanel from "components/system/Taskbar/TaskbarPanel";
import ScrollBars from "styles/common/ScrollBars";
import {
  THIN_SCROLLBAR_WIDTH,
  THIN_SCROLLBAR_WIDTH_NON_WEBKIT,
} from "utils/constants";

type StyledStartMenuProps = {
  $showScrolling: boolean;
};

const StyledStartMenu = styled(motion.nav)<StyledStartMenuProps>`
  ${({ theme }) =>
    TaskbarPanel(theme.sizes.startMenu.maxHeight, theme.sizes.startMenu.size)}

  background-color: ${({ theme }) => theme.colors.startMenu.background};
  border: none;
  box-shadow:
    2px 2px 0 #0a0010,
    inset 1px 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
    inset -1px -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
  padding-left: ${({ theme }) => theme.sizes.startMenu.bandWidth}px;

  .brand-band {
    background: ${({ theme }) =>
      `linear-gradient(180deg, ${theme.colors.startMenu.bandBackground} 0%, ${theme.colors.startMenu.bandGradient} 100%)`};
    bottom: 0;
    box-shadow: inset -1px 0 0
      ${({ theme }) => theme.colors.taskbar.bevelBottom};
    color: ${({ theme }) => theme.colors.startMenu.bandText};
    display: flex;
    font-family: Verdana, Tahoma, sans-serif;
    font-size: 14px;
    font-weight: 400;
    justify-content: center;
    left: 0;
    letter-spacing: 2px;
    padding-bottom: 12px;
    position: absolute;
    top: 0;
    transform: rotate(180deg);
    width: ${({ theme }) => theme.sizes.startMenu.bandWidth}px;
    writing-mode: vertical-rl;

    strong {
      font-weight: 700;
    }
  }

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: ${({ theme }) => theme.colors.startMenu.background};
  }

  .search-trigger {
    align-items: center;
    background: ${({ theme }) => theme.colors.startMenu.bandBackground};
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
    bottom: 0;
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    display: flex;
    font-size: 12px;
    gap: 6px;
    left: ${({ theme }) => theme.sizes.startMenu.bandWidth}px;
    padding: 6px 10px;
    position: absolute;
    right: 0;

    &:hover {
      background: ${({ theme }) => theme.colors.startMenu.itemHover};
    }

    svg {
      height: 14px;
      width: 14px;
    }
  }

  ${StyledFileManager} {
    ${ScrollBars(THIN_SCROLLBAR_WIDTH, -2, -1)};
    margin-top: 0;
    overflow-x: hidden;
    padding: 4px 0 36px;

    ${StyledFileEntry} {
      width: ${({ theme }) =>
        `${
          theme.sizes.startMenu.size -
          THIN_SCROLLBAR_WIDTH -
          theme.sizes.startMenu.bandWidth
        }px`};

      @supports not selector(::-webkit-scrollbar) {
        width: ${({ theme }) =>
          `${
            theme.sizes.startMenu.size -
            THIN_SCROLLBAR_WIDTH_NON_WEBKIT -
            theme.sizes.startMenu.bandWidth
          }px`};
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.startMenu.itemHover};
      }

      &:active {
        background-color: ${({ theme }) => theme.colors.startMenu.itemActive};
      }
    }

    ${StyledFileEntry}[data-pinned="true"]:not([data-pinned="true"] ~ [data-pinned="true"]) {
      border-top: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
      box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
      margin-top: 4px;
      padding-top: 4px;
    }

    ${StyledFileManager} {
      margin: 0;
      overflow: hidden;
      padding: 0;
      scrollbar-gutter: auto;

      figure {
        picture {
          margin-left: 11px;
        }

        &:active {
          picture {
            margin-left: 15px;
          }
        }

        picture,
        svg {
          transition: none;
        }
      }
    }

    @supports not selector(::-webkit-scrollbar) {
      scrollbar-width: ${({ $showScrolling }) =>
        $showScrolling ? "thin" : "none"};
    }

    &::-webkit-scrollbar {
      width: ${({ $showScrolling }) =>
        $showScrolling ? THIN_SCROLLBAR_WIDTH : 0}px;
    }

    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background-color: ${({ $showScrolling }) =>
        $showScrolling ? undefined : "transparent"};
    }

    &::-webkit-scrollbar-button:single-button {
      background-color: ${({ $showScrolling }) =>
        $showScrolling ? undefined : "transparent"};
      border: ${({ $showScrolling }) =>
        $showScrolling ? undefined : "1px solid transparent"};
    }

    &::-webkit-scrollbar-thumb:vertical {
      background-color: ${({ $showScrolling }) =>
        $showScrolling ? undefined : "rgb(167, 167, 167)"};
    }
  }
`;

export default StyledStartMenu;
