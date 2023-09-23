import { isLocationInBounds } from "functional-game-utils";
import addLocations from "./addLocations";

function getLocationsInSquare(tiles, origin, magnitude) {
  const locations = [];

  for (let rowAdjust = 0; rowAdjust <= magnitude; rowAdjust++) {
    for (let colAdjust = 0; colAdjust <= magnitude; colAdjust++) {
      locations.push(
        addLocations(origin, { row: -rowAdjust, col: colAdjust }),
        addLocations(origin, { row: rowAdjust, col: colAdjust }),
        addLocations(origin, { row: rowAdjust, col: -colAdjust }),
        addLocations(origin, { row: -rowAdjust, col: -colAdjust })
      );
    }
  }
  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
}

export default getLocationsInSquare;
