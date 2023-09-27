import React, { useCallback, useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import statusCode from "../../data/asciiArt/statusCode.txt";
import Line from "./Line";
import Sequence from "./Sequence";
import wait from "../utils/wait";

const MainMenu = () => {
  const [shouldTypeStart, setShouldTypeStart] = useState(false);
  const { changeScene } = useRootStore();

  useEffect(() => {
    const startGame = () => {
      setShouldTypeStart(true);
    };

    document.addEventListener("click", startGame);

    return () => document.removeEventListener("click", startGame);
  }, []);

  return (
    <>
      <Sequence>
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
        <Line inline typed clearCursor={!shouldTypeStart} />
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
            {"init #[success game]"}
          </Line>
        ) : null}
      </Sequence>
    </>
  );
};

export default MainMenu;
