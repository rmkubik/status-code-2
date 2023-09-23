import addLocations from "./addLocations";

function addToLocationRow(location, value) {
  return addLocations(location, { row: value, col: 0 });
}

export default addToLocationRow;
