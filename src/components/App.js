import {
  compareLocations,
  getCrossDirections,
  getLocation,
  getNeighbors,
  isLocationInBounds,
} from "functional-game-utils";
import React, { useState } from "react";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { RootContextProvider, rootStore, useRootStore } from "../models/Root";
import Grid from "./Grid";
import Tile from "./Tile";

const theme = {
  tileSize: 32,
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const App = () => {
  const [selected, setSelected] = useState();
  const { grid } = useRootStore();

  return (
    <>
      <GlobalStyle />
      <Grid
        renderTile={(tile, location) => {
          const isSelected = selected && compareLocations(selected, location);
          const selectedNeighborLocations = selected
            ? grid.getEmptyNeighbors(selected)
            : [];

          const isUnitSelected = selected && grid.getUnitAtLocation(selected);

          const isMoveTarget =
            isUnitSelected &&
            selectedNeighborLocations.some((neighborLocation) =>
              compareLocations(neighborLocation, location)
            );

          return (
            <Tile
              key={`${location.row}.${location.col}`}
              tile={tile}
              location={location}
              isSelected={isSelected}
              isMoveTarget={isMoveTarget}
              onClick={() => {
                if (isMoveTarget) {
                  const selectedUnit = grid.getUnitAtLocation(selected);

                  if (selectedUnit) {
                    selectedUnit.move(location);
                    setSelected(location);
                  }

                  return;
                }

                if (isSelected) {
                  setSelected();
                  return;
                }

                setSelected(location);
              }}
            />
          );
        }}
      />
    </>
  );
};

const withProviders = (WrappedComponent) => {
  return () => {
    return (
      <RootContextProvider value={rootStore}>
        <ThemeProvider theme={theme}>
          <WrappedComponent />
        </ThemeProvider>
      </RootContextProvider>
    );
  };
};

export default withProviders(App);
