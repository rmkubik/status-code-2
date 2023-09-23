import addLocations from "./addLocations";

function addToLocationCol(location, value) {
  return addLocations(location, { row: 0, col: value });
}

export default addToLocationCol;
