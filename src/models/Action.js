import { getParentOfType, types } from "mobx-state-tree";
import Unit from "./Unit";
import Grid from "./Grid";

const Action = types
  .model({
    name: types.string,
    range: types.number,
    damage: types.number,
  })
  .views((self) => ({
    getLocationsInRange() {
      const grid = getParentOfType(self, Grid);
      const unit = getParentOfType(self, Unit);

      // TODO:
      // Hard code action to just get neighbors
      // Actually need to support more advanced
      // targeting shapes in the future!

      const neighbors = grid.getNeighbors(unit.head);

      return neighbors;
    },
  }));

export default Action;
