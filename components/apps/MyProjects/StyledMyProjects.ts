import styled from "styled-components";

export const ProjectCard = styled.li<{ $accent: string }>`
  align-items: center;
  background: #221641;
  border: 1px solid #3a2660;
  border-left: 4px solid ${({ $accent }) => $accent};
  border-radius: 8px;
  display: grid;
  gap: 12px;
  grid-template-columns: 64px 1fr auto;
  padding: 14px;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background: #2b1c52;
    box-shadow:
      0 0 0 1px ${({ $accent }) => $accent},
      0 6px 18px rgb(0 0 0 / 40%);
    transform: translateY(-2px);
  }

  .meta h2 {
    color: #f1ebff;
    font-size: 15px;
    margin: 0 0 4px;
  }

  .meta > p {
    color: #b7a6dd;
    font-size: 12px;
    line-height: 1.4;
    margin: 0 0 8px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tags span {
    background: #3a2660;
    border-radius: 10px;
    color: #cbb8f0;
    font-size: 10px;
    padding: 2px 8px;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .actions button {
    border: 0;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    padding: 7px 14px;
  }

  .actions .open {
    background: #60c;
    color: #fff;
  }

  .actions .open:hover {
    background: #c0f;
  }

  .actions .ghost {
    background: transparent;
    border: 1px solid #4b3478;
    color: #cbb8f0;
    font-size: 15px;
    padding: 4px 10px;
  }

  .actions .ghost:hover {
    border-color: ${({ $accent }) => $accent};
    color: #fff;
  }
`;

const StyledMyProjects = styled.div`
  background: linear-gradient(160deg, #1a0f33 0%, #0d0720 100%);
  color: #e9e0ff;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  header {
    margin-bottom: 18px;

    h1 {
      color: #d9c7ff;
      font-size: 22px;
      margin: 0 0 6px;
    }

    p {
      color: #a88fd8;
      font-size: 13px;
      margin: 0;
      max-width: 560px;
    }
  }

  ul {
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export default StyledMyProjects;
