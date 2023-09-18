import { compareLocations } from "functional-game-utils";
import React, { useState } from "react";
import { ThemeProvider } from "styled-components";
import { RootContextProvider, rootStore, useRootStore } from "../models/Root";
import Grid from "./Grid";
import Tile from "./Tile";
import UnitPanel from "./UnitPanel";
import { observer } from "mobx-react-lite";
import GlobalStyle from "../css/GlobalStyle";

const theme = {
  tileSize: 40,
};

const App = observer(() => {
  const [selected, setSelected] = useState();
  const { grid, game, endTurn, state } = useRootStore();

  const { selectedActionIndex } = game;
  const selectedUnit = grid.getUnitAtLocation(selected);

  return (
    <>
      <Grid
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
      </div>
      <UnitPanel unit={selectedUnit} />
    </>
  );
});

const withProviders = (WrappedComponent) => {
  return () => {
    return (
      <RootContextProvider value={rootStore}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <WrappedComponent />
        </ThemeProvider>
      </RootContextProvider>
    );
  };
};

export default withProviders(App);
