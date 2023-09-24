import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";
import styled from "styled-components";

const DelaySpan = styled.span`
  opacity: 0;
  animation-delay: ${(props) => props.delay}ms;
`;

const BattleIntro = () => {
  const { changeScene, currentLevelKey, levelLoader } = useRootStore();

  // console.log(levelLoader.getIntro(currentLevelKey));
  const intro = levelLoader.getIntro(currentLevelKey);

  useEffect(() => {
    const changeToBattle = () => changeScene("battle");

    document.addEventListener("click", changeToBattle);

    return () => document.removeEventListener("click", changeToBattle);
  }, []);

  return (
    <>
      <h1>Start Battle!</h1>
      <p>Initiating connection attempt</p>
      <p>
        Target: {levelLoader.getName(currentLevelKey)}
        <DelaySpan className="popIn animated" delay={200}>
          .
        </DelaySpan>
        <DelaySpan className="popIn animated" delay={400}>
          .
        </DelaySpan>
        <DelaySpan className="popIn animated" delay={600}>
          .
        </DelaySpan>
      </p>
      {intro.map((introItem, index) => {
        switch (introItem.type) {
          case "text":
            return <p key={index}>{introItem.value}</p>;
          case "asciiArt":
            return <pre key={index}>{introItem.value}</pre>;
        }
      })}
      <p>
        Click to establish connection...
        <span className="cursorFlash animated infinite">|</span>
      </p>
    </>
  );
};

export default BattleIntro;
