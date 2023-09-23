import React from "react";
import { useRootStore } from "../models/Root";
import { observer } from "mobx-react-lite";
import Grid from "./Grid";

const BattleGrid = observer(({ renderTile = () => {} }) => {
  const { grid } = useRootStore();

  return <Grid renderTile={renderTile} tiles={grid.tiles} />;
});

export default BattleGrid;
