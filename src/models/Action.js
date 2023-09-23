import { getParentOfType, types } from "mobx-state-tree";
import Unit from "./Unit";
import Grid from "./Grid";
import getLocationsInCross from "../utils/getLocationsInCross";
import getLocationsInDiamond from "../utils/getLocationsInDiamond";
import { compareLocations } from "functional-game-utils";
import getLocationsInSquare from "../utils/getLocationsInSquare";

const Action = types
  .model("Action", {
    name: types.string,
    range: types.number,
    damage: types.number,
    shape: types.enumeration(["cross", "diamond", "square"]),
  })
  .views((self) => ({
    getLocationsInRange() {
      const grid = getParentOfType(self, Grid);
      const unit = getParentOfType(self, Unit);

      let locationsInShape = [];

      switch (self.shape) {
        case "cross":
          locationsInShape = getLocationsInCross(
            grid.tiles,
            unit.head,
            self.range
          );
          break;
        case "diamond":
          locationsInShape = getLocationsInDiamond(
            grid.tiles,
            unit.head,
            self.range
          );
          break;
        case "square":
          locationsInShape = getLocationsInSquare(
            grid.tiles,
            unit.head,
            self.range
          );
          break;
      }

      // Remove unit's head
      return locationsInShape.filter(
        (location) => !compareLocations(location, unit.head)
      );
    },
  }));

export default Action;
