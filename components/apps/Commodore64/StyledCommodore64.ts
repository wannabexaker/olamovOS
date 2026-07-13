import styled from "styled-components";
import Message from "styles/common/Message";

const StyledCommodore64 = styled.div`
  &.drop {
    ${Message(
      "Drop a Commodore 64 file here (.d64, .t64, .prg, .crt)",
      "#f1f1f1"
    )};
  }
`;

export default StyledCommodore64;
