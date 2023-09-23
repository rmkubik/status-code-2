import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";

const Map = () => {
  const { changeScene } = useRootStore();

  return (
    <ul>
      <li>
        <button onClick={() => changeScene("battleIntro")}>Start Battle</button>
      </li>
    </ul>
  );
};

export default Map;
