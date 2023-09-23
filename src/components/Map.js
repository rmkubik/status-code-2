import React, { useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import map from "bundle-text:../../data/map.txt";
import Grid from "./Grid";
import {
  compareLocations,
  constructArray,
  constructMatrixFromTemplate,
  getLocation,
} from "functional-game-utils";
import Tile from "./Tile";
import { observer } from "mobx-react-lite";
import { Tile as TileModel } from "../models/Grid";
import MyPrograms from "./MyPrograms";

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

const Map = observer(() => {
  const [selected, setSelected] = useState();
  const { startBattle, levelLoader, inventory, unitFactory } = useRootStore();

  const selectedTile = selected && getLocation(tiles, selected);
  let isValidLevelSelected = false;

  if (selectedTile) {
    if (isLevelIcon(selectedTile.icon) && levelLoader.has(selectedTile.icon)) {
      isValidLevelSelected = true;
    }
  }

  return (
    <>
      <h1>The Cloud</h1>
      <Grid
        tiles={tiles}
        renderTile={(tile, location) => (
          <Tile
            key={`${location.row}.${location.col}`}
            isMapTile
            isSelected={selected && compareLocations(location, selected)}
            tile={tile}
            onClick={() => {
              setSelected(location);
            }}
          />
        )}
      />
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
      <MyPrograms />
    </>
  );
});

export default Map;
