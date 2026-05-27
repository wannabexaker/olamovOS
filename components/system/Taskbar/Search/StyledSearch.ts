import { m as motion } from "motion/react";
import styled from "styled-components";
import { SINGLE_LINE_HEIGHT_ADDITION } from "components/system/Taskbar/Search";
import TaskbarPanel from "components/system/Taskbar/TaskbarPanel";

type StyledSearchProps = {
  $singleLine: boolean;
};

const StyledSearch = styled(motion.nav)<StyledSearchProps>`
  ${({ $singleLine, theme }) =>
    TaskbarPanel(
      theme.sizes.search.maxHeight +
        ($singleLine ? SINGLE_LINE_HEIGHT_ADDITION : 0),
      theme.sizes.search.size,
      theme.sizes.taskbar.button.width,
      true
    )}

  backdrop-filter: ${({ theme }) => `blur(${theme.sizes.taskbar.panelBlur})`};
  background-color: ${({ theme }) => theme.colors.startMenu.background};

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: ${({ theme }) => theme.colors.startMenu.background};
  }

  @keyframes fade-in {
    0% {
      opacity: 0%;
    }

    100% {
      opacity: 100%;
    }
  }

  .search {
    width: 100%;

    input {
      appearance: none;
      background-color: ${({ theme }) => theme.colors.startMenu.bandBackground};
      border: 2px solid ${({ theme }) => theme.colors.highlight};
      border-radius: 0;
      caret-color: ${({ theme }) => theme.colors.highlight};
      color: ${({ theme }) => theme.colors.text};
      font-size: 15px;
      height: 40px;
      padding: 10px;
      padding-left: 37px;
      width: 100%;

      &::placeholder {
        color: ${({ theme }) => theme.colors.text};
        inset: 0;
        left: 37px;
        opacity: 70%;
        overflow: visible;
      }

      &::-webkit-search-cancel-button {
        margin: 0 0 0 8px;
      }
    }

    svg {
      bottom: 12px;
      height: 16px;
      left: 12px;
      position: absolute;
      width: 16px;
      z-index: 2;
    }
  }

  .content {
    animation: fade-in 0.85s;
    height: calc(100% - 40px);

    .no-results {
      display: flex;
      font-size: 14px;
      font-weight: 300;
      padding: 5px 15px;
      place-items: center;
      pointer-events: none;
      user-select: none;

      svg {
        fill: ${({ theme }) => theme.colors.text};
        height: 32px;
        margin-right: 12px;
        width: 32px;
      }
    }

    .tab {
      color: ${({ theme }) => theme.colors.text};
      display: flex;
      flex-direction: column;
      height: ${({ theme }) =>
        `calc(100% - ${theme.sizes.search.headerHeight}px - ${theme.sizes.search.inputHeight}px)`};
      place-content: center;
      place-items: center;
      position: absolute;
      top: ${({ theme }) => `${theme.sizes.search.headerHeight}px`};
      width: 100%;

      h1 {
        font-size: 28px;
        font-weight: 400;
        padding-top: 14px;
      }

      h3 {
        font-size: 14px;
        font-weight: 400;
        padding-top: 8px;
      }

      svg {
        fill: ${({ theme }) => theme.colors.highlight};
        height: 128px;
        width: 128px;
      }
    }

    > nav {
      position: absolute;
      right: 25px;
      top: 15px;

      .close-button svg {
        fill: ${({ theme }) => theme.colors.text};
        height: 14px;

        &:hover {
          fill: ${({ theme }) => theme.colors.highlight};
        }
      }
    }
  }

  > div {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
`;

export default StyledSearch;
