import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Typed from "typed.js";
import formatLineText from "../utils/formatText/formatLineText";

/**
 * These colors need to be kept in sync with
 * the onces in GlobalStyle for .line
 */
const getColor = (props) => {
  switch (props.color) {
    case "warn":
      return "yellow";
    case "error":
      return "red";
    case "success":
      return "green";
    case "normal":
    default:
      return "";
  }
};

const LineContainer = styled.div`
  white-space: pre-wrap;
  display: ${(props) => (props.inline ? "inline-block" : "block")};
  min-height: 1em;
  font-weight: ${(props) => (props.bold ? "bold" : "normal")};
  color: ${getColor};
`;

const useDelay = (delayDuration) => {
  const [delayBlocked, setDelayBlocked] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayBlocked(false);
    }, delayDuration);

    return () => clearTimeout(timeoutId);
  }, [delayDuration]);

  return delayBlocked;
};

const useTyped = ({
  typedOptions,
  clearCursor,
  text,
  onFinished,
  startTyping,
}) => {
  const lineRef = useRef();
  const containerRef = useRef();
  const typedRef = useRef();

  const hideCursor = () => {
    typedRef.current.showCursor = false;
    containerRef.current.querySelector(".typed-cursor").style.display = "none";
  };

  const onComplete = () => {
    // if (clearCursor) {
    //   hideCursor();
    // }

    onFinished();
  };

  useEffect(() => {
    if (clearCursor && typedRef.current?.typingComplete) {
      hideCursor();
    }
  }, [clearCursor, typedRef.current?.typingComplete]);

  useEffect(() => {
    if (!startTyping) {
      return;
    }

    console.log({ text });

    typedRef.current = new Typed(lineRef.current, {
      strings: [text],
      typeSpeed: 40,
      ...typedOptions,
      onComplete,
    });

    return () => typedRef.current.destroy();
  }, [startTyping]);

  return { containerRef, lineRef };
};

const processText = ({ typed, children }) => {
  if (typed) {
    return "";
  }

  if (typeof children === "string") {
    // return formatLineText(children);
    return;
  }

  return children;
};

const getTextString = ({ typed, children }) => {
  if (typed) {
    return;
  }

  if (typeof children !== "string") {
    return;
  }

  return formatLineText(children);
};

const DangerouslySetSpan = ({ children }) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: formatLineText(children),
      }}
    />
  );
};

const Line = ({
  children,
  typed = false,
  delay = 0,
  typedOptions = {},
  inline = false,
  clearCursor = true,
  asciiArt = false,
  alt = "",
  bold = false,
  color = "normal", // normal, success, error, warn
  onFinished = () => {},
}) => {
  const delayBlocked = useDelay(delay);
  const { lineRef, containerRef } = useTyped({
    typedOptions,
    clearCursor,
    text:
      !asciiArt && typeof children === "string" ? formatLineText(children) : "",
    startTyping: !delayBlocked && typed,
    onFinished,
  });

  useEffect(() => {
    if (!typed && !delayBlocked) {
      onFinished();
    }
  }, [typed, delayBlocked]);

  if (delayBlocked) {
    return null;
  }

  return (
    <LineContainer
      className="line"
      inline={inline}
      bold={bold}
      color={color}
      ref={containerRef}
    >
      {asciiArt ? (
        <pre ref={lineRef} role="img" aria-label={alt}>
          {typed ? "" : children}
        </pre>
      ) : !typed && typeof children === "string" ? (
        <DangerouslySetSpan>{children}</DangerouslySetSpan>
      ) : (
        <span ref={lineRef}>{processText({ children, typed })}</span>
      )}
    </LineContainer>
  );
};

export default Line;
