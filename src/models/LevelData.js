import { getParentOfType, getSnapshot, types } from "mobx-state-tree";
import UnitLevelData from "./UnitLevelData";
import { constructMatrixFromTemplate } from "functional-game-utils";
import isInt from "../utils/isInt";
import Grid from "./Grid";
import { RootModel } from "./Root";

const LevelData = types
  .model("LevelData", {
    name: types.string,
    tiles: types.string,
    units: types.array(UnitLevelData),
  })
  .actions((self) => ({
    createGrid() {
      const units = [];
      const deployLocations = [];

      const tiles = constructMatrixFromTemplate((char, location) => {
        let icon = char;

        if (isInt(char)) {
          const unitSnapshot = getSnapshot(self.units[parseInt(char)]);
          // This is a unit spawn location
          units.push({
            ...unitSnapshot,
            location,
          });
          // After handling unit, mark tile as empty.
          icon = ".";
        }

        if (char === "*") {
          // This is a deploy location
          deployLocations.push(location);
          icon = ".";
        }

        return {
          icon,
        };
      }, self.tiles);

      const grid = Grid.create({
        tiles,
        deployLocations,
        units: [],
      });

      const { unitFactory } = getParentOfType(self, RootModel);
      units.forEach((unit) => {
        grid.createUnit(unit, unitFactory);
      });

      return grid;
    },
  }));

export default LevelData;
