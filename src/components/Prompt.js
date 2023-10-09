import React, { useEffect, useState } from "react";
import Line from "./Line";
import { useRootStore } from "../models/Root";
import useGlobalClickOnce from "../utils/useGlobalClickOnce";

const Prompt = ({ onFinished, children }) => {
  const [prompted, setPrompted] = useState(false);

  useGlobalClickOnce(() => setPrompted(true));

  return (
    <>
      <Line bold inline>
        {"$ "}
      </Line>
      <Line inline typed clearCursor={prompted} />
      {prompted ? (
        <Line bold inline typed clearCursor={false} onFinished={onFinished}>
          {children}
        </Line>
      ) : null}
    </>
  );
};

export default Prompt;
