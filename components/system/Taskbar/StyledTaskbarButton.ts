import styled from "styled-components";
import Button from "styles/common/Button";

type StyledTaskbarButtonProps = {
  $active: boolean;
  $highlight?: boolean;
  $left?: number;
};

const StyledTaskbarButton = styled(Button)<StyledTaskbarButtonProps>`
  background-color: ${({ $active, $highlight, theme }) =>
    $active &&
    ($highlight
      ? theme.colors.taskbar.foreground
      : theme.colors.taskbar.active)};
  box-shadow: ${({ $active, theme }) =>
    $active
      ? `inset 0 -1px 0 ${theme.colors.taskbar.bevelTop},
         inset 0 1px 0 ${theme.colors.taskbar.bevelBottom}`
      : `inset 0 1px 0 ${theme.colors.taskbar.bevelTop},
         inset 0 -1px 0 ${theme.colors.taskbar.bevelBottom}`};
  display: flex;
  fill: ${({ theme }) => theme.colors.taskbar.button.color};
  gap: 6px;
  height: 100%;
  left: ${({ $left }) => ($left ? `${$left}px` : 0)};
  place-content: center;
  place-items: center;
  position: absolute;

  && {
    width: ${({ theme }) => theme.sizes.taskbar.button.width}px;
  }

  svg {
    height: ${({ theme }) => theme.sizes.taskbar.button.iconSize};
  }

  span {
    color: ${({ theme }) => theme.colors.taskbar.button.color};
    font-size: 13px;
    font-weight: 700;
  }

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.colors.taskbar.foreground : theme.colors.taskbar.hover};

    svg {
      fill: ${({ $highlight, theme }) =>
        $highlight ? theme.colors.highlight : undefined};
    }
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.taskbar.active};
    box-shadow:
      inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
      inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};

    svg {
      fill: ${({ $highlight }) =>
        $highlight ? "hsla(207, 100%, 60%, 80%)" : undefined};
    }
  }
`;

export default StyledTaskbarButton;
