import styled from "styled-components";

export const DockButton = styled.button<{ $accent: string }>`
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  height: 34px;
  justify-content: center;
  position: relative;
  transition: transform 0.14s ease;
  width: 34px;

  &:hover {
    transform: scale(1.18);
  }

  .tip {
    background: rgb(20 10 40 / 92%);
    border: 1px solid ${({ $accent }) => `${$accent}66`};
    border-radius: 6px;
    color: #eadfff;
    font-size: 11px;
    opacity: 0%;
    padding: 3px 8px;
    pointer-events: none;
    position: absolute;
    right: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    transition: opacity 0.14s ease;
    white-space: nowrap;
  }

  &:hover .tip {
    opacity: 100%;
  }
`;

// A small, translucent, macOS-style icon dock pinned to the right edge. Icons
// only, low-opacity until hovered, driven entirely by PROJECTS.
const StyledProjectDock = styled.div`
  backdrop-filter: blur(8px);
  background: rgb(24 15 52 / 32%);
  border: 1px solid rgb(204 0 255 / 16%);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  opacity: 55%;
  padding: 5px;
  position: fixed;
  right: 7px;
  top: 50%;
  transform: translateY(-50%);
  transition:
    opacity 0.18s ease,
    background 0.18s ease;
  z-index: 10000;

  &:hover {
    background: rgb(24 15 52 / 60%);
    opacity: 100%;
  }
`;

export default StyledProjectDock;
