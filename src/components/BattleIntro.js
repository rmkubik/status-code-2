import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";

const BattleIntro = () => {
  const { changeScene } = useRootStore();

  useEffect(() => {
    const changeToBattle = () => changeScene("battle");

    document.addEventListener("click", changeToBattle);

    return () => document.removeEventListener("click", changeToBattle);
  }, []);

  return (
    <>
      <h1>Start Battle!</h1>
      <p>Click to start...</p>
    </>
  );
};

export default BattleIntro;
