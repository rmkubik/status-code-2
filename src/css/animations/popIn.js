import { css } from "styled-components";

const duration = 0;
const popIn = css`
  @keyframes popIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .popIn {
    animation-name: popIn;
    animation-duration: ${duration}ms;
  }
`;

export default popIn;
export { duration };
