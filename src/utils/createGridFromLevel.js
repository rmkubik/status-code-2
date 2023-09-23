import { constructMatrixFromTemplate } from "functional-game-utils";
import Grid from "../models/Grid";
import isInt from "./isInt";

function createGridFromLevel(level, unitFactory) {
  const units = [];

  const tiles = constructMatrixFromTemplate((char, location) => {
    let icon = char;

    if (isInt(char)) {
      // This is a unit spawn location
      units.push({
        location,
        ...level.units[parseInt(char)],
      });
      // After handling unit, mark tile as empty.
      icon = ".";
    }

    return {
      icon,
    };
  }, level.tiles);

  const grid = Grid.create({
    tiles,
    units: [],
  });

  units.forEach((unit) => {
    grid.createUnit(unit, unitFactory);
  });

  return grid;
}

export default createGridFromLevel;
