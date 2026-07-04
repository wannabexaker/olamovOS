import styled from "styled-components";

// Screen-reader / crawler visible, but visually hidden. We intentionally avoid
// `display: none` / `visibility: hidden` so search engines still index the
// content while it never overlays the desktop UI.
const StyledSeo = styled.section`
  border: 0;
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export default StyledSeo;
