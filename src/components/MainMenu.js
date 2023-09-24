import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";
import statusCode from "../../data/asciiArt/statusCode.txt";
import Line from "./Line";
import Sequence from "./Sequence";

const MainMenu = () => {
  const { changeScene } = useRootStore();

  useEffect(() => {
    const changeToMap = () => changeScene("map");

    document.addEventListener("click", changeToMap);

    return () => document.removeEventListener("click", changeToMap);
  }, []);

  return (
    <>
      <Sequence>
        <Line asciiArt alt="Status Code">
          {statusCode}
        </Line>
        <Line inline>Click to start</Line>
        <Line inline typed>
          ^200.^400.^600.
        </Line>
      </Sequence>
    </>
  );
};

export default MainMenu;
