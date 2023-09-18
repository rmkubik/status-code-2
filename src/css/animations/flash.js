import { css } from "styled-components";

const duration = 200;
const flash = css`
  @keyframes flash {
    from,
    50%,
    to {
      opacity: 1;
    }

    25%,
    75% {
      opacity: 0;
    }
  }

  .flash {
    animation-name: flash;
    animation-duration: ${duration}ms;
  }
`;

export default flash;
export { duration };
