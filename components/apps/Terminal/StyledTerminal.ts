import styled from "styled-components";
import ScrollBars from "styles/common/ScrollBars";

const StyledTerminal = styled.div`
  height: 100%;
  width: 100%;

  .terminal {
    height: 100% !important;
  }

  .xterm-viewport {
    ${ScrollBars()};
    width: 100% !important;
  }

  .xterm-screen {
    .xterm-rows {
      .xterm-cursor-underline {
        border-bottom-color: #cc00ff !important;
        border-bottom-width: 4px !important;
      }

      .xterm-cursor-blink {
        animation-duration: 1.067s !important;
      }
    }
  }
`;

export default StyledTerminal;
