import styled from "styled-components";

const StyledOlamovStream = styled.div`
  background: ${({ theme }) => theme.colors.startMenu.background};
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  .url-bar {
    background: ${({ theme }) => theme.colors.startMenu.bandBackground};
    border-bottom: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    padding: 6px 8px;

    input {
      background: rgb(0 0 0 / 35%);
      border: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
      border-radius: 2px;
      color: ${({ theme }) => theme.colors.text};
      flex: 1;
      font-family: inherit;
      font-size: 12px;
      outline: none;
      padding: 4px 8px;

      &:focus {
        border-color: ${({ theme }) => theme.colors.highlight};
      }
    }

    button {
      border: none;
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      padding: 4px 12px;
    }

    .play {
      background: ${({ theme }) => theme.colors.highlight};
      box-shadow:
        inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
        inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      color: #fff;

      &:hover {
        filter: brightness(1.15);
      }

      &:active {
        box-shadow:
          inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
          inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      }
    }

    .search {
      background: ${({ theme }) => theme.colors.startMenu.itemHover};
      box-shadow:
        inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
        inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      color: ${({ theme }) => theme.colors.text};

      &:hover {
        background: ${({ theme }) => theme.colors.startMenu.itemActive};
      }

      &:active {
        box-shadow:
          inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
          inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      }
    }
  }

  .error {
    background: rgb(180 30 30 / 40%);
    color: #ffdada;
    flex-shrink: 0;
    font-size: 11px;
    padding: 4px 10px;
  }

  .player {
    background: #000;
    border: none;
    flex: 1;
    width: 100%;
  }

  .empty {
    align-items: center;
    color: ${({ theme }) => theme.colors.text};
    display: flex;
    flex: 1;
    flex-direction: column;
    font-size: 13px;
    justify-content: center;
    padding: 20px;
    text-align: center;

    .hint {
      color: rgb(255 255 255 / 50%);
      font-size: 11px;
      margin-top: 8px;
    }
  }

  .controls {
    align-items: center;
    background: ${({ theme }) => theme.colors.startMenu.bandBackground};
    border-top: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
    box-shadow: inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
    display: flex;
    flex-shrink: 0;
    gap: 6px;
    padding: 5px 8px;

    button {
      background: ${({ theme }) => theme.colors.startMenu.itemHover};
      border: none;
      box-shadow:
        inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
        inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      color: ${({ theme }) => theme.colors.text};
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      min-width: 30px;
      padding: 3px 8px;

      &:hover {
        background: ${({ theme }) => theme.colors.startMenu.itemActive};
      }

      &:active {
        box-shadow:
          inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
          inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      }
    }

    .loop {
      font-size: 11px;
      min-width: 64px;
    }

    .position {
      color: rgb(255 255 255 / 60%);
      font-size: 11px;
      font-variant-numeric: tabular-nums;
      margin-left: auto;
    }
  }

  .queue {
    background: rgb(0 0 0 / 25%);
    flex-shrink: 0;
    list-style: none;
    margin: 0;
    max-height: 132px;
    overflow-y: auto;
    padding: 0;

    li {
      align-items: center;
      border-bottom: 1px solid rgb(255 255 255 / 8%);
      display: flex;

      &.active {
        background: ${({ theme }) => theme.colors.startMenu.itemActive};
      }

      &:hover {
        background: ${({ theme }) => theme.colors.startMenu.itemHover};
      }
    }

    .queue-play {
      align-items: center;
      background: none;
      border: none;
      color: ${({ theme }) => theme.colors.text};
      cursor: pointer;
      display: flex;
      flex: 1;
      font-family: inherit;
      font-size: 11px;
      gap: 6px;
      overflow: hidden;
      padding: 6px 8px;
      text-align: left;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badge {
      background: ${({ theme }) => theme.colors.highlight};
      border-radius: 2px;
      color: #fff;
      flex-shrink: 0;
      font-size: 9px;
      padding: 1px 4px;
      text-transform: uppercase;
    }

    .queue-remove {
      background: none;
      border: none;
      color: rgb(255 255 255 / 55%);
      cursor: pointer;
      flex-shrink: 0;
      font-size: 12px;
      padding: 6px 10px;

      &:hover {
        color: #ffdada;
      }
    }
  }
`;

export default StyledOlamovStream;
