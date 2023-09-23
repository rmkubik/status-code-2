import React, { useEffect } from "react";
import { useRootStore } from "../models/Root";
import map from "bundle-text:../../data/map.txt";
import Grid from "./Grid";
import {
  constructArray,
  constructMatrixFromTemplate,
  initArray,
} from "functional-game-utils";
import Tile from "./Tile";
import { observer } from "mobx-react-lite";
import { Tile as TileModel } from "../models/Grid";
import level1 from "../../data/levels/1.yaml";

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

const Map = observer(() => {
  const { startBattle } = useRootStore();

  return (
    <ul>
      <Grid
        tiles={tiles}
        renderTile={(tile, location) => (
          <Tile
            key={`${location.row}.${location.col}`}
            isMapTile
            tile={tile}
            onClick={() => {
              startBattle(level1);
            }}
          />
        )}
      />
      <li>
        <button onClick={() => changeScene("battleIntro")}>Start Battle</button>
      </li>
    </ul>
  );
});

export default Map;
