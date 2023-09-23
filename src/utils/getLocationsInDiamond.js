import { isLocationInBounds } from "functional-game-utils";
import addToLocationRow from "./addToLocationRow";
import addLocations from "./addLocations";

function getLocationsInDiamond(tiles, origin, magnitude) {
  const locations = [];

  // get a triangle from top to bottom
  // then stack another triangle upside down underneath it
  // height of each triangle === magnitude

  for (let depth = 0; depth <= magnitude; depth++) {
    // top of diamond
    locations.push(addToLocationRow(origin, -magnitude + depth));
    // bottom of diamond
    locations.push(addToLocationRow(origin, magnitude - depth));

    if (depth === 0) {
      // only add additional columns after the peak
      continue;
    }

    for (let layerWidth = 1; layerWidth <= depth; layerWidth++) {
      // top rows of diamond
      locations.push(
        addLocations(origin, { row: -magnitude + depth, col: layerWidth }),
        addLocations(origin, { row: -magnitude + depth, col: -layerWidth })
      );
      //bottom rows of diamond
      locations.push(
        addLocations(origin, { row: magnitude - depth, col: layerWidth }),
        addLocations(origin, { row: magnitude - depth, col: -layerWidth })
      );
    }
  }

  return locations.filter((inAreaLocation) =>
    isLocationInBounds(tiles, inAreaLocation)
  );
}

export default getLocationsInDiamond;
