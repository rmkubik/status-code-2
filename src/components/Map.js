import React, { useMemo, useState } from "react";
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
import styled from "styled-components";
import isLevelIcon from "../utils/levels/isLevelIcon";
import getUnlockedLocations from "../utils/levels/getUnlockedLocations";
import ServerInfo from "./ServerInfo";
import Chat from "./Chat";
import Tabs from "./Tabs";

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
      startLocation: { row: 2, col: 0 },
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
