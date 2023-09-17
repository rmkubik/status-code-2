import { compareLocations } from "functional-game-utils";
import React, { useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { RootContextProvider, rootStore, useRootStore } from "../models/Root";
import Grid from "./Grid";
import Tile from "./Tile";
import UnitPanel from "./UnitPanel";
import { observer } from "mobx-react-lite";

const theme = {
  tileSize: 32,
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: Menlo,Courier,monospace;
    color: white;
    background-color: black;
  }

  button {
    color: white;
    border: 1px solid white;
    background: none;
    height: fit-content;
    padding: 6px 6px;
    font-size: 1rem;

    &:hover {
      cursor: pointer;
      border-style: dashed;
    }

    &.selected {
      color: black;
      background-color: white;
    }

    &.disabled {
      opacity: 0.5;
    }
  }
`;

const App = observer(() => {
  const [selected, setSelected] = useState();
  const { grid, game, endTurn } = useRootStore();

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
        <p style={{ marginRight: "1rem" }}>Turn: {game.currentTurn + 1}</p>
        <button onClick={endTurn}>End Turn</button>
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
