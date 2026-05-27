import styled from "styled-components";
import { ThinScrollBars } from "components/system/Taskbar/Search/styles";
import ScrollBars from "styles/common/ScrollBars";
import { THIN_SCROLLBAR_WIDTH } from "utils/constants";

const StyledResults = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  height: ${({ theme }) =>
    `calc(100% - ${theme.sizes.search.headerHeight}px - ${theme.sizes.search.inputHeight}px)`};
  position: absolute;
  top: ${({ theme }) => `${theme.sizes.search.headerHeight}px`};
  width: 100%;

  .list {
    ${ScrollBars(THIN_SCROLLBAR_WIDTH, -2, -1)}
    ${ThinScrollBars}
    background-color: ${({ theme }) => theme.colors.startMenu.background};
    overflow-y: auto;
    scrollbar-gutter: auto;
    width: 100%;

    li {
      &.active-item {
        background-color: ${({ theme }) => theme.colors.startMenu.itemActive};
      }

      position: relative;

      figure {
        display: flex;
        padding: 12px;
        padding-right: 32px;

        picture,
        img {
          height: 32px;
          max-height: 32px;
          max-width: 32px;
          min-height: 32px;
          min-width: 32px;
          width: 32px;
        }

        figcaption {
          font-size: 8px;
          margin-top: -2px;
          max-width: calc(100% - 26px);
          padding-left: 8px;

          h1 {
            font-size: 14.5px;
            font-weight: 400;
            overflow: hidden;
            padding-right: 12px;
            text-overflow: ellipsis;

            span {
              font-weight: 600;
            }
          }

          h2 {
            font-size: 13px;
            font-weight: 300;
            padding-top: 6px;
          }
        }

        &.simple {
          padding: 10px;

          picture,
          img {
            height: 16px;
            max-height: 16px;
            max-width: 16px;
            min-height: 16px;
            min-width: 16px;
            width: 16px;
          }

          figcaption {
            h1 {
              font-size: 14px;
              font-weight: 300;
              white-space: nowrap;
            }
          }
        }

        picture:not(:first-child) {
          position: absolute;

          img {
            position: absolute;
          }
        }
      }

      div.select {
        border-left: 1px solid transparent;
        display: flex;
        height: 100%;
        place-content: center;
        place-items: center;
        position: absolute;
        right: 0;
        top: 0;
        width: 26px;

        svg {
          fill: ${({ theme }) => theme.colors.text};
          height: 16px;
          width: 16px;
        }
      }

      &:hover {
        background-color: ${({ theme }) => theme.colors.startMenu.itemHover};

        div.select {
          background-color: ${({ theme }) =>
            theme.colors.startMenu.bandBackground};
          border-left: 1px solid
            ${({ theme }) => theme.colors.taskbar.bevelBottom};
        }

        figure {
          &:not(:hover) {
            background-color: ${({ theme }) =>
              theme.colors.startMenu.bandBackground};
          }
        }

        &.active-item {
          background-color: ${({ theme }) => theme.colors.startMenu.itemActive};
        }
      }

      div.select:hover {
        background-color: ${({ theme }) => theme.colors.startMenu.itemHover};
      }
    }
  }
`;

export default StyledResults;
