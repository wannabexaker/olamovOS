import styled from "styled-components";
import { TASKBAR_HEIGHT } from "utils/constants";

const StyledDesktop = styled.main`
  background-color: transparent;
  contain: strict;
  height: 100%;
  inset: 0;
  min-width: 800px;
  overflow: clip;
  overscroll-behavior: none;
  position: fixed;
  width: 100%;

  &::before {
    color: #cc00ff;
    content: "Olamov Universe\\A systems. intelligence. experiments.";
    font-size: 14px;
    line-height: 1.7;
    pointer-events: none;
    position: absolute;
    right: 24px;
    text-align: right;
    text-shadow: 1px 1px 0 #0a0010;
    top: 24px;
    white-space: pre;
    z-index: 1;
  }

  &::after {
    bottom: ${TASKBAR_HEIGHT + 8}px;
    color: #fff;
    content: "© 1999 Olamov Systems. All rights reserved.";
    font-size: 12px;
    left: 8px;
    pointer-events: none;
    position: absolute;
    text-shadow: 1px 1px 0 #0a0010;
    z-index: 1;
  }

  #loading-status {
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 8px;
    box-shadow: 0 0 50px 1px #000;
    display: none;
    font-weight: 600;
    left: 50%;
    padding: 12px 15px;
    pointer-events: none;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    user-select: none;
  }

  > canvas {
    background-color: inherit;
    height: 100%;
    left: 0;
    object-fit: cover;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }
`;

export default StyledDesktop;
