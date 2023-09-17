function addLocations(a, b) {
  return {
    row: a.row + b.row,
    col: a.col + b.col,
  };
}

export default addLocations;
