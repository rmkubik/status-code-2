import { css } from "styled-components";

const duration = 1000;
const cursorFlash = css`
  @keyframes cursorFlash {
    from,
    30% {
      opacity: 1;
    }

    15% {
      opacity: 0;
    }
  }

  .cursorFlash {
    animation-name: cursorFlash;
    animation-duration: ${duration}ms;
  }
`;

export default cursorFlash;
export { duration };
