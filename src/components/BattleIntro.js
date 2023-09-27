import React, { useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import Line from "./Line";
import Sequence from "./Sequence";
import wait from "../utils/wait";

const BattleIntro = () => {
  const { changeScene, currentLevelKey, levelLoader } = useRootStore();
  const [shouldTypeStart, setShouldTypeStart] = useState(false);

  const intro = levelLoader.getIntro(currentLevelKey);

  useEffect(() => {
    const startGame = () => {
      setShouldTypeStart(true);
    };

    document.addEventListener("click", startGame);

    return () => document.removeEventListener("click", startGame);
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
          Click to establish connection
        </Line>
        <Line inline typed clearCursor={false}>
          ^200...
        </Line>
        <Line />
        <Line bold inline>
          ${" "}
        </Line>
        <Line inline typed clearCursor={!shouldTypeStart} />
        {shouldTypeStart ? (
          <Line
            bold
            inline
            typed
            clearCursor={false}
            onFinished={async () => {
              await wait(500);
              changeScene("battle");
            }}
          >
            {"connect #[success server]"}
          </Line>
        ) : null}
      </Sequence>
    </>
  );
};

export default BattleIntro;
