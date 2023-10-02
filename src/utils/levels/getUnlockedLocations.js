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

export default getUnlockedLocations;
