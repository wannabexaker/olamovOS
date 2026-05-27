import styled from "styled-components";

const StyledTabs = styled.ol`
  border-bottom: 1px solid ${({ theme }) => theme.colors.taskbar.bevelBottom};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  font-size: 12px;
  font-weight: 600;
  gap: 1px;
  padding: 2px 13px 0;
  position: absolute;
  width: 100%;

  li {
    color: ${({ theme }) => theme.colors.text};
    padding: 15px 13px 14px;

    &.active {
      border-bottom: 4px solid ${({ theme }) => theme.colors.highlight};
      color: ${({ theme }) => theme.colors.highlight};
    }

    &:hover {
      color: ${({ theme }) => theme.colors.highlight};
    }
  }
`;

export default StyledTabs;
