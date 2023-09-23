import { types } from "mobx-state-tree";
import UnitLevelData from "./UnitLevelData";

const LevelData = types
  .model({
    tiles: types.string,
    units: types.array(UnitLevelData),
  })
  .actions((self) => ({
    createGrid() {
      const units = [];

      const tiles = constructMatrixFromTemplate((char, location) => {
        let icon = char;

        if (isInt(char)) {
          // This is a unit spawn location
          units.push({
            location,
            ...self.units[parseInt(char)],
          });
          // After handling unit, mark tile as empty.
          icon = ".";
        }

        return {
          icon,
        };
      }, self.tiles);

      const grid = Grid.create({
        tiles,
        units: [],
      });

      units.forEach((unit) => {
        grid.createUnit(unit);
      });

      return grid;
    },
  }));

export default LevelData;
