import { createGlobalStyle } from "styled-components";
import animations from "./animations/*.js";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: Menlo,Courier,monospace;
    color: white;
    background-color: black;
  }

  button {
    color: white;
    border: 1px solid white;
    background: none;
    height: fit-content;
    padding: 6px 6px;
    font-size: 1rem;

    &:hover {
      cursor: pointer;
      border-style: dashed;
    }

    &.selected {
      color: black;
      background-color: white;
    }

    &.disabled, &:disabled {
      opacity: 0.5;
    }
  }

  ${Object.values(animations).map((animationModule) => animationModule.default)}

  .animated {
    animation-fill-mode: both;

    &.infinite {
      animation-iteration-count: infinite;
    }
  }

  .line {
    .error {
      color: ${(props) => props.theme.colors.error};
    }

    .success {
      color: ${(props) => props.theme.colors.success};
    }

    .warn {
      color: ${(props) => props.theme.colors.warn};
    }

    .normal {
      color: "inherit";
    }

    .info {
      color: ${(props) => props.theme.colors.info};
    }

    .bold {
      font-weight: bold;
    }
  }
`;

export default GlobalStyle;
