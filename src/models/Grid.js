import { compareLocations } from "functional-game-utils";
import { types } from "mobx-state-tree";

const Tile = types.model({
  icon: types.string,
});

const Location = types.model({
  row: types.number,
  col: types.number,
});

const Unit = types
  .model({
    tailIcon: types.string,
    headIcon: types.string,
    location: Location,
    parts: types.array(Location),
    maxLength: types.number,
  })
  .actions((self) => ({
    move(location) {
      self.parts.unshift(location);
      self.parts = self.parts.slice(0, self.maxLength);
    },
  }));

const TileRow = types.array(Tile);

const Grid = types
  .model({
    tiles: types.optional(types.array(TileRow), []),
    units: types.optional(types.array(Unit), []),
  })
  .views((self) => ({
    getUnitAtLocation(location) {
      const selectedUnit = self.units.find((unit) => {
        return unit.parts.some((partLocation) =>
          compareLocations(partLocation, location)
        );
      });

      if (!selectedUnit) {
        return undefined;
      }

      return selectedUnit;
    },
  }));

export default Grid;
