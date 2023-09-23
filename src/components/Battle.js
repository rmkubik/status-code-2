import { compareLocations } from "functional-game-utils";
import React, { useState } from "react";
import { useRootStore } from "../models/Root";
import BattleGrid from "./BattleGrid";
import Tile from "./Tile";
import UnitPanel from "./UnitPanel";
import { observer } from "mobx-react-lite";

const Battle = observer(() => {
  const [selected, setSelected] = useState();
  const { grid, game, endTurn, state, changeScene } = useRootStore();

  const { selectedActionIndex } = game;
  const selectedUnit = grid.getUnitAtLocation(selected);

  return (
    <>
      <BattleGrid
        renderTile={(tile, location) => {
          const isSelected = selected && compareLocations(selected, location);
          const isUnitSelected = Boolean(selectedUnit);

          const isMoveTarget =
            isUnitSelected &&
            selectedUnit.isPlayerOwned() &&
            selectedUnit.isHeadLocation(selected) &&
            selectedUnit.canUnitMoveToLocation(grid, location);

          const isActionTarget =
            selectedActionIndex !== -1 &&
            selectedUnit.canUnitActionAtLocation(location, selectedActionIndex);

          return (
            <Tile
              key={`${location.row}.${location.col}`}
              tile={tile}
              location={location}
              isSelected={isSelected}
              isActionTarget={isActionTarget}
              isMoveTarget={isMoveTarget}
              onClick={() => {
                if (isMoveTarget) {
                  if (selectedUnit) {
                    selectedUnit.move(location);
                    setSelected(location);
                  }

                  return;
                }

                if (isActionTarget) {
                  if (selectedUnit) {
                    selectedUnit.takeAction(selectedActionIndex, location);
                    game.setSelectedActionIndex(-1);
                  }

                  return;
                }

                if (isSelected) {
                  setSelected();
                  game.setSelectedActionIndex(-1);

                  return;
                }

                game.setSelectedActionIndex(-1);
                setSelected(location);
              }}
            />
          );
        }}
      />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <p style={{ marginRight: "1rem" }}>Turn: {game.currentTurn + 1}</p>
        <button
          className={state === "enemyActing" ? "disabled" : ""}
          onClick={endTurn}
        >
          End Turn
        </button>
        <button onClick={() => changeScene("map")}>Disconnect</button>
      </div>
      <UnitPanel unit={selectedUnit} />
    </>
  );
});

export default Battle;
