import React, { useEffect, useMemo, useState } from "react";
import { useRootStore } from "../models/Root";
import map from "bundle-text:../../data/map.txt";
import Grid from "./Grid";
import {
  compareLocations,
  constructArray,
  constructMatrixFromTemplate,
  floodFill,
  getCrossDirections,
  getLocation,
  getNeighbors,
} from "functional-game-utils";
import Tile from "./Tile";
import { observer } from "mobx-react-lite";
import { Tile as TileModel } from "../models/Grid";
import MyPrograms from "./MyPrograms";
import styled from "styled-components";

const mapWithDots = map.replaceAll(" ", ".");
let mapWithSpaces = "";
mapWithDots.split("").forEach((char, index) => {
  mapWithSpaces += char;

  if (char !== "\n" && mapWithDots[index + 1] !== "\n") {
    mapWithSpaces += " ";
  }
});

const tiles = constructMatrixFromTemplate(
  (icon) => TileModel.create({ icon }),
  mapWithSpaces
);

function getLongestRowLength(matrix) {
  return Math.max(...matrix.map((row) => row.length));
}

function padEndRows(matrix, value) {
  const width = getLongestRowLength(matrix);

  for (let row of matrix) {
    const paddingLength = width - row.length;

    if (paddingLength > 0) {
      const padding = constructArray(() => value, paddingLength);

      row.push(...padding);
    }
  }
}

padEndRows(tiles, { icon: "." });

// https://www.compart.com/en/unicode/block/U+2500
function isBoxDrawingChar(char) {
  const charCode = char.charCodeAt(0);

  return charCode >= 0x2500 && charCode <= 0x257f;
}

function isLevelIcon(icon) {
  return !isBoxDrawingChar(icon) && icon !== ".";
}

function getUnlockedLocations({ startLocation, tiles, saveData }) {
  return floodFill(
    getNeighbors((tile) => {
      if (isLevelIcon(tile.icon) && !saveData.isCompleted(tile.icon)) {
        return [];
      }

      return getCrossDirections();
    }),
    (tile, location) => {
      if (isLevelIcon(tile.icon)) {
        return true;
      }

      if (isBoxDrawingChar(tile.icon)) {
        return true;
      }

      return false;
    },
    tiles,
    [startLocation],
    [],
    []
  );
}

const MapContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
`;

const RightPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  *:not(:last-child) {
    margin-right: 1rem;
  }
`;

const Map = observer(() => {
  const [selected, setSelected] = useState();
  const { startBattle, levelLoader, saveData } = useRootStore();

  const selectedTile = selected && getLocation(tiles, selected);
  let isValidLevelSelected = false;

  const unlockedLocations = useMemo(() => {
    return getUnlockedLocations({
      startLocation: { row: 2, col: 0 },
      tiles,
      saveData,
    });
  }, [saveData, tiles]);

  if (selectedTile) {
    if (isLevelIcon(selectedTile.icon) && levelLoader.has(selectedTile.icon)) {
      isValidLevelSelected = true;
    }
  }

  return (
    <MapContainer>
      <div>
        <h1>The Cloud</h1>
        <Grid
          tiles={tiles}
          renderTile={(tile, location) => (
            <Tile
              key={`${location.row}.${location.col}`}
              isMapTile
              isSelected={selected && compareLocations(location, selected)}
              isCompleted={
                isLevelIcon(tile.icon) && saveData.isCompleted(tile.icon)
              }
              tile={
                unlockedLocations.some((unlockedLocation) =>
                  compareLocations(unlockedLocation, location)
                )
                  ? tile
                  : { icon: "" }
              }
              onClick={() => {
                setSelected(location);
              }}
            />
          )}
        />
      </div>
      <RightPanelContainer>
        <div>
          <h2>Server Info</h2>
          <Row>
            <p>
              {selectedTile && levelLoader.has(selectedTile.icon)
                ? levelLoader.getName(selectedTile.icon)
                : "UNDEFINED"}
            </p>
            <button
              disabled={!isValidLevelSelected}
              onClick={() => {
                if (isLevelIcon(selectedTile.icon)) {
                  startBattle(selectedTile.icon);
                }
              }}
            >
              Connect
            </button>
          </Row>
        </div>
        <MyPrograms />
      </RightPanelContainer>
    </MapContainer>
  );
});

export default Map;
