import styled from "styled-components";

const StyledShutdown = styled.div`
  background-color: #c0c0c0;
  color: #000;
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  font-size: 12px;
  height: 100%;
  padding: 12px;

  figure {
    align-items: flex-start;
    display: flex;
    gap: 12px;
    margin: 0;
  }

  figcaption {
    flex: 1;
  }

  label {
    display: block;
    margin-bottom: 7px;
  }

  select {
    background: #fff;
    border-color: #404040 #fff #fff #404040;
    border-style: solid;
    border-width: 2px;
    color: #000;
    font-family: Arial, sans-serif;
    font-size: 12px;
    height: 24px;
    width: 100%;
  }

  p {
    border-top: 1px solid #808080;
    box-shadow: inset 0 1px #fff;
    line-height: 1.3;
    margin: 14px 0 0;
    min-height: 33px;
    padding-top: 8px;
  }

  nav {
    display: flex;
    gap: 7px;
    justify-content: flex-end;
    margin-top: auto;
  }
`;

export default StyledShutdown;
