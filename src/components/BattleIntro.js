import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";
import Line from "./Line";
import Sequence from "./Sequence";

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
      {/* <h1>Start Battle!</h1> */}
      <Sequence flattenChildren>
        <Line>Initiating connection attempt</Line>
        <Line inline delay={200}>
          {"Target: "}
        </Line>
        <Line typed inline delay={200}>
          {levelLoader.getName(currentLevelKey)}
        </Line>
        <Line typed inline>
          ^100.^500.^500.
        </Line>
        <Line />
        {intro.map((introItem, index) => {
          switch (introItem.type) {
            default:
            case "text":
              return (
                <Line delay={200} key={index}>
                  {introItem.value}
                </Line>
              );
            case "asciiArt":
              return (
                <Line delay={200} key={index} asciiArt alt={introItem.alt}>
                  {introItem.value}
                </Line>
              );
          }
        })}
        <Line />
        <Line inline delay={600}>
          Click to establish connection...
        </Line>
        <Line inline typed clearCursor={false} />
      </Sequence>

      {/* 
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
      </p> */}
    </>
  );
};

export default BattleIntro;
