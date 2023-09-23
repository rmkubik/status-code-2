import { isLocationInBounds } from "functional-game-utils";
import addToLocationCol from "./addToLocationCol";
import addToLocationRow from "./addToLocationRow";

function getLocationsInCross(tiles, origin, magnitude) {
  const locations = [];

  for (let m = 1; m <= magnitude; m++) {
    locations.push(
      addToLocationRow(origin, -m),
      addToLocationRow(origin, m),
      addToLocationCol(origin, -m),
      addToLocationCol(origin, m)
    );
  }

  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
}

export default getLocationsInCross;
