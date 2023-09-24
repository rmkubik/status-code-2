import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";
import statusCode from "bundle-text:../../data/asciiArt/statusCode.txt";

const MainMenu = () => {
  const { changeScene } = useRootStore();

  useEffect(() => {
    const changeToMap = () => changeScene("map");

    document.addEventListener("click", changeToMap);

    return () => document.removeEventListener("click", changeToMap);
  }, []);

  return (
    <>
      <pre>{statusCode}</pre>
      <p>
        Click to start...
        <span className="cursorFlash animated infinite">|</span>
      </p>
    </>
  );
};

export default MainMenu;
