import { css } from "styled-components";

const duration = 200;
const pulse = css`
  @keyframes pulse {
    from {
      transform: scale3d(1, 1, 1);
    }

    50% {
      transform: scale3d(1.07, 1.07, 1.07);
    }

    to {
      transform: scale3d(1, 1, 1);
    }
  }
  .pulse {
    animation-name: pulse;
    animation-timing-function: ease-in-out;
    transform-origin: center;
    animation-duration: ${duration}ms;
  }
`;

export default pulse;
export { duration };
