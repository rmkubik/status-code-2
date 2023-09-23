import React, { useEffect, useState } from "react";
import { useRootStore } from "../models/Root";
import map from "bundle-text:../../data/map.txt";
import Grid from "./Grid";
import {
  compareLocations,
  constructArray,
  constructMatrixFromTemplate,
  getLocation,
  initArray,
} from "functional-game-utils";
import Tile from "./Tile";
import { observer } from "mobx-react-lite";
import { Tile as TileModel } from "../models/Grid";
import level1 from "../../data/levels/1.yaml";
import isInt from "../utils/isInt";

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
  const { startBattle } = useRootStore();

  const selectedTile = selected && getLocation(tiles, selected);

  return (
    <ul>
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
      <li>
        <button
          disabled={selectedTile ? !isLevelIcon(selectedTile.icon) : true}
          onClick={() => {
            if (isLevelIcon(selectedTile.icon)) {
              startBattle(selectedTile.icon);
            }
          }}
        >
          Connect
        </button>
      </li>
    </ul>
  );
});

export default Map;
