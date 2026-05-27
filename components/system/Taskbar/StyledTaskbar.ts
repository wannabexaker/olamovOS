import styled from "styled-components";
import { TASKBAR_HEIGHT } from "utils/constants";

const TASKBAR_Z_INDEX = 100000;

const StyledTaskbar = styled.nav`
  background-color: ${({ theme }) => theme.colors.taskbar.background};
  bottom: 0;
  box-shadow:
    inset 0 1px 0 ${({ theme }) => theme.colors.taskbar.bevelTop},
    inset 0 -1px 0 ${({ theme }) => theme.colors.taskbar.bevelBottom};
  contain: size layout;
  height: ${TASKBAR_HEIGHT}px;
  left: 0;
  min-width: 800px;
  position: absolute;
  right: 0;
  width: 100%;
  z-index: ${TASKBAR_Z_INDEX};

  &::after {
    backdrop-filter: ${({ theme }) => `blur(${theme.sizes.taskbar.blur})`};
    content: "";
    display: block;
    height: 100%;
    position: relative;
    width: 100%;
    z-index: -${TASKBAR_Z_INDEX};
  }
`;

export default StyledTaskbar;
