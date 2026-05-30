import { m as motion } from "motion/react";
import styled from "styled-components";
import { TASKBAR_HEIGHT } from "utils/constants";

type StyledVolumeButtonProps = {
  $clockWidth: number;
  $hasAI: boolean;
};

export const StyledVolumeButton = styled.button<StyledVolumeButtonProps>`
  align-items: center;
  background: none;
  border: none;
  border-left: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
  box-shadow: inset 1px 0 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  position: absolute;
  right: ${({ $clockWidth, $hasAI, theme }) =>
    `calc(${$clockWidth}px + ${theme.sizes.clock.padding * 2}px + ${$hasAI ? theme.sizes.taskbar.ai.buttonWidth : "0px"})`};
  width: ${({ theme }) => theme.sizes.taskbar.volume.buttonWidth};

  &:hover {
    background-color: ${({ theme }) => theme.colors.taskbar.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.taskbar.foreground};
  }
`;

export const StyledVolumePanel = styled(motion.section)<{
  $clockWidth: number;
  $hasAI: boolean;
}>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.startMenu.background};
  border: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
  bottom: ${TASKBAR_HEIGHT}px;
  box-shadow:
    2px 2px 0 hsl(0 0% 0% / 35%),
    inset 1px 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
    inset -1px -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 6px 10px;
  position: absolute;
  right: ${({ $clockWidth, $hasAI, theme }) =>
    `calc(${$clockWidth}px + ${theme.sizes.clock.padding * 2}px + ${
      $hasAI ? theme.sizes.taskbar.ai.buttonWidth : "0px"
    })`};
  width: 78px;
  z-index: 100001;

  h4 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
    box-shadow: 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
    color: ${({ theme }) => theme.colors.text};
    font-size: 11px;
    font-weight: 600;
    margin: 10px 0 0;
    padding-bottom: 6px;
    text-align: center;
    width: 100%;
  }

  .slider-well {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    min-height: 110px;
  }

  .volume-slider {
    appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    direction: rtl;
    height: 110px;
    width: 22px;
    writing-mode: vertical-lr;

    &::-webkit-slider-runnable-track {
      background: hsl(265 40% 12%);
      box-shadow:
        inset 1px 1px 0 hsl(0 0% 0% / 45%),
        inset -1px -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
      width: 5px;
    }

    &::-webkit-slider-thumb {
      appearance: none;
      background: ${({ theme }) => theme.colors.highlight};
      border: 1px solid hsl(0 0% 0% / 40%);
      box-shadow:
        inset 1px 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
        inset -1px -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
      cursor: pointer;
      height: 11px;
      margin-left: -9px;
      width: 22px;
    }

    &::-moz-range-track {
      background: hsl(265 40% 12%);
      width: 5px;
    }

    &::-moz-range-thumb {
      background: ${({ theme }) => theme.colors.highlight};
      border: 1px solid hsl(0 0% 0% / 40%);
      border-radius: 0;
      height: 11px;
      width: 22px;
    }
  }

  .mute-toggle {
    align-items: center;
    border-top: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
    box-shadow: 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop};
    color: ${({ theme }) => theme.colors.text};
    cursor: pointer;
    display: flex;
    font-size: 11px;
    gap: 5px;
    justify-content: center;
    padding-top: 8px;
    user-select: none;
    width: 100%;

    input {
      accent-color: ${({ theme }) => theme.colors.highlight};
      cursor: pointer;
      margin: 0;
    }
  }
`;
