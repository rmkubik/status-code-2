import { isLocationInBounds } from "functional-game-utils";
import addLocations from "./addLocations";

function getLocationsOneStepCloser(tiles, origin, target) {
  let options = [];

  if (target.row > origin.row) {
    options.push(addLocations(origin, { row: 1, col: 0 }));
  }

  if (target.row < origin.row) {
    options.push(addLocations(origin, { row: -1, col: 0 }));
  }

  if (target.col > origin.col) {
    options.push(addLocations(origin, { row: 0, col: 1 }));
  }

  if (target.col < origin.col) {
    options.push(addLocations(origin, { row: 0, col: -1 }));
  }

  options = options.filter((option) => isLocationInBounds(tiles, option));

  return options;
}

export default getLocationsOneStepCloser;
