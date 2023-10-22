import React, { useMemo, useState } from "react";
import { useRootStore } from "../models/Root";
import mapTxt from "bundle-text:../../data/map.txt";
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
import styled from "styled-components";
import isLevelIcon from "../utils/levels/isLevelIcon";
import getUnlockedLocations from "../utils/levels/getUnlockedLocations";
import ServerInfo from "./ServerInfo";
import Chat from "./Chat";
import Tabs from "./Tabs";

import map from "../../data/map.json";
import tileset from "../../data/tiles.json";
import TiledMap from "../utils/tiled/TiledMap";

console.log({ map, tileset });

const tiledMap = TiledMap.create({ map, tileset });
const tiles = tiledMap.createGameTiles();

console.log({ tiles });

// const mapWithDots = mapTxt.replaceAll(" ", ".");
// let mapWithSpaces = "";
// mapWithDots.split("").forEach((char, index) => {
//   mapWithSpaces += char;

//   if (char !== "\n" && mapWithDots[index + 1] !== "\n") {
//     mapWithSpaces += " ";
//   }
// });

// const tiles = constructMatrixFromTemplate(
//   (icon) => TileModel.create({ icon }),
//   mapWithSpaces
// );

// function getLongestRowLength(matrix) {
//   return Math.max(...matrix.map((row) => row.length));
// }

// function padEndRows(matrix, value) {
//   const width = getLongestRowLength(matrix);

//   for (let row of matrix) {
//     const paddingLength = width - row.length;

//     if (paddingLength > 0) {
//       const padding = constructArray(() => value, paddingLength);

//       row.push(...padding);
//     }
//   }
// }

// padEndRows(tiles, { icon: "." });

const MapContainer = styled.div`
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 1rem;
`;

const RightPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Map = observer(() => {
  const [selected, setSelected] = useState();
  const { saveData } = useRootStore();

  const unlockedLocations = useMemo(() => {
    return getUnlockedLocations({
      startLocation: tiledMap.map.startLocation,
      tiles,
      saveData,
    });
  }, [saveData.levels.size, tiles]);

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
              isCompleted={tile.levelKey && saveData.isCompleted(tile.levelKey)}
              tile={
                unlockedLocations.some((unlockedLocation) =>
                  compareLocations(unlockedLocation, location)
                )
                  ? tile
                  : { icon: "" }
                // tile
              }
              onClick={() => {
                setSelected(location);
              }}
            />
          )}
        />
      </div>
      <RightPanelContainer>
        <ServerInfo selected={selected} tiles={tiles} />
        <Tabs>
          <Tabs.Tab title="My Programs">
            <MyPrograms />
          </Tabs.Tab>
          <Tabs.Tab title="Chat">
            <Chat />
          </Tabs.Tab>
        </Tabs>
      </RightPanelContainer>
    </MapContainer>
  );
});

export default Map;
