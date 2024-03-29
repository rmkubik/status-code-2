import { compareLocations } from "functional-game-utils";
import React, { useState } from "react";
import { useRootStore } from "../models/Root";
import BattleGrid from "./BattleGrid";
import Tile from "./Tile";
import UnitPanel from "./UnitPanel";
import { observer } from "mobx-react-lite";
import MyPrograms from "./MyPrograms";

const Battle = observer(() => {
  const { grid, game, endBattle } = useRootStore();
  const { selectedLocation, selectedUnit } = grid;
  const { selectedActionIndex, undoPlayerAction } = game;

  return (
    <>
      <BattleGrid
        renderTile={(tile, location) => {
          const isSelected = grid.isSelectedLocation(location);
          const isUnitSelected = Boolean(selectedUnit);

          const isMoveTarget =
            isUnitSelected &&
            selectedUnit.isPlayerOwned &&
            selectedUnit.isHeadLocation(selectedLocation) &&
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
                      game.trackPlayerAction({ type: "takeUnitMove" });
                      selectedUnit.move(location);
                      grid.selectLocation(location);
                    }

                    return;
                  }

                  if (isActionTarget) {
                    if (selectedUnit) {
                      game.trackPlayerAction({ type: "takeUnitAction" });
                      selectedUnit.takeAction(selectedActionIndex, location);
                      game.setSelectedActionIndex(-1);
                    }

                    return;
                  }
                }

                if (isSelected) {
                  grid.deSelectLocation();
                  game.setSelectedActionIndex(-1);

                  return;
                }

                game.setSelectedActionIndex(-1);
                grid.selectLocation(location);
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
        <p>
          Energy: {game.energy.current}/{game.energy.max}
        </p>
        <button
          style={{ marginRight: "1rem" }}
          disabled={game.state !== "playerActing"}
          onClick={game.endTurn}
        >
          End Turn
        </button>
        <button onClick={undoPlayerAction} style={{ marginRight: "1rem" }}>
          Undo
        </button>
        <button onClick={endBattle}>Disconnect</button>
      </div>
      <UnitPanel unit={selectedUnit} location={selectedLocation} />
      {game.state === "deployment" && (
        <>
          <MyPrograms mode="deployment" selectedLocation={selectedLocation} />
          <button onClick={game.finishDeployment}>Finish Deployment</button>
        </>
      )}
    </>
  );
});

export default Battle;
