import {
  floodFill,
  getCrossDirections,
  getNeighbors,
} from "functional-game-utils";
import isLevelIcon from "./isLevelIcon";
import isBoxDrawingChar from "./isBoxDrawingChar";

function getUnlockedLocations({ startLocation, tiles, saveData }) {
  return floodFill(
    getNeighbors((tile) => {
      if (tile.levelKey && !saveData.isCompleted(tile.levelKey)) {
        return [];
      }

      return getCrossDirections();
    }),
    (tile, location) => {
      if (tile.levelKey) {
        return true;
      }

      if (tile.hasAnyConnection) {
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

export default getUnlockedLocations;
