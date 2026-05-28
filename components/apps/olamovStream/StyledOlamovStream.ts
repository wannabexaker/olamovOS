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
      background: ${({ theme }) => theme.colors.startMenu.itemHover};
      border: none;
      box-shadow:
        inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
        inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      color: ${({ theme }) => theme.colors.text};
      cursor: pointer;
      font-family: inherit;
      font-size: 12px;
      padding: 4px 12px;

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
`;

export default StyledOlamovStream;
