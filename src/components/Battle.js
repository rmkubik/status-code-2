import { compareLocations } from "functional-game-utils";
import React, { useState } from "react";
import { useRootStore } from "../models/Root";
import BattleGrid from "./BattleGrid";
import Tile from "./Tile";
import UnitPanel from "./UnitPanel";
import { observer } from "mobx-react-lite";
import MyPrograms from "./MyPrograms";

const Battle = observer(() => {
  const [selected, setSelected] = useState();
  const { grid, game, changeScene } = useRootStore();

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
              isDeployLocation={
                game.state === "deployment" && grid.isDeployLocation(location)
              }
              onClick={() => {
                if (game.state === "playerActing") {
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
        {game.state === "victory" && <p>Victory!</p>}
        {game.state === "defeat" && <p>Defeat!</p>}
        <p style={{ marginRight: "1rem" }}>Turn: {game.currentTurn + 1}</p>
        <button disabled={game.state !== "playerActing"} onClick={game.endTurn}>
          End Turn
        </button>
        <button onClick={() => changeScene("map")}>Disconnect</button>
      </div>
      <UnitPanel unit={selectedUnit} location={selected} />
      {game.state === "deployment" && (
        <>
          <MyPrograms mode="deployment" selectedLocation={selected} />
          <button onClick={game.finishDeployment}>Finish Deployment</button>
        </>
      )}
    </>
  );
});

export default Battle;
