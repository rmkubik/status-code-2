import React, { useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import Line from "./Line";
import Sequence from "./Sequence";
import wait from "../utils/wait";
import Prompt from "./Prompt";

const BattleIntro = () => {
  const { changeScene, currentLevelKey, levelLoader } = useRootStore();
  const [isSequenceFinished, setIsSequenceFinished] = useState(false);

  const intro = levelLoader.getIntro(currentLevelKey);

  return (
    <>
      <Sequence onFinished={() => setIsSequenceFinished(true)} flattenChildren>
        <Line>Initiating connection attempt</Line>
        <Line bold inline delay={200}>
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
        <Line inline typed>
          ^200...
        </Line>
        <Line />
      </Sequence>
      {isSequenceFinished ? (
        <Prompt
          onFinished={async () => {
            await wait(500);
            changeScene("battle");
          }}
        >
          {"connect $[success server]"}
        </Prompt>
      ) : null}
    </>
  );
};

export default BattleIntro;
