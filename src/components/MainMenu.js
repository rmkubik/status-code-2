import React from "react";
import { useRootStore } from "../models/Root";
import statusCode from "../../data/asciiArt/statusCode.txt";
import Line from "./Line";
import Sequence from "./Sequence";
import wait from "../utils/wait";
import Prompt from "./Prompt";

const MainMenu = () => {
  const { changeScene } = useRootStore();

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
      </Sequence>
      <Prompt
        onFinished={async () => {
          await wait(800);
          changeScene("map");
        }}
      >
        {"init $[success game]"}
      </Prompt>
    </>
  );
};

export default MainMenu;
