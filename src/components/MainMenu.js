import React, { useCallback, useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import statusCode from "../../data/asciiArt/statusCode.txt";
import Line from "./Line";
import Sequence from "./Sequence";
import wait from "../utils/wait";
import Sprite from "./Sprite";
import tiles from "../../data/art/tiles.png";

const MainMenu = () => {
  const { changeScene } = useRootStore();
  const [shouldTypeStart, setShouldTypeStart] = useState(false);
  const [isSequenceFinished, setIsSequenceFinished] = useState(false);

  useEffect(() => {
    const startGame = () => {
      if (!isSequenceFinished) {
        return;
      }

      setShouldTypeStart(true);
    };

    document.addEventListener("click", startGame);

    return () => document.removeEventListener("click", startGame);
  }, [isSequenceFinished]);

  return (
    <>
      <Sequence
        onFinished={() => {
          setIsSequenceFinished(true);
        }}
      >
        <Line asciiArt alt="Status Code">
          {statusCode}
        </Line>
        <Line>Click to start...</Line>
        <Line />
        <Line />
        <Line />
        <Line bold inline>
          ${" "}
        </Line>
        <Line inline typed clearCursor={shouldTypeStart} />
        {shouldTypeStart ? (
          <Line
            bold
            inline
            typed
            clearCursor={false}
            onFinished={async () => {
              await wait(800);
              changeScene("map");
            }}
          >
            {"init $[success game]"}
          </Line>
        ) : null}
      </Sequence>
    </>
  );
};

export default MainMenu;
