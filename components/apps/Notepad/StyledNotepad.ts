import styled from "styled-components";
import ScrollBars from "styles/common/ScrollBars";

const StyledNotepad = styled.div`
  background: #c0c0c0;
  color: #000;
  display: grid;
  font-family: ${({ theme }) => theme.formats.systemFont};
  grid-template-rows: 24px 1fr;
  height: 100%;
  width: 100%;

  menu {
    align-items: center;
    border-bottom: 1px solid #808080;
    display: flex;
    gap: 16px;
    padding: 0 8px;
  }

  textarea {
    ${ScrollBars(17, 0, 0, "light")};
    background: #f7f0ff;
    border-color: #fff #808080 #808080 #fff;
    border-style: solid;
    border-width: 2px;
    color: #1a0033;
    font-family: "Lucida Console", "Courier New", monospace;
    font-size: 14px;
    line-height: 1.6;
    padding: 12px;
    resize: none;
    width: 100%;
  }
`;

export default StyledNotepad;
