import { types } from "mobx-state-tree";
import Location from "./Location";
import { compareLocations } from "functional-game-utils";

const Unit = types
  .model({
    tailIcon: types.string,
    headIcon: types.string,
    location: Location,
    parts: types.array(Location),
    maxLength: types.number,
    name: types.string,
    moves: types.model({
      current: types.optional(types.number, 0),
      max: types.number,
    }),
    actions: types.array(
      types.model({
        name: types.string,
        range: types.number,
        damage: types.number,
      })
    ),
  })
  .views((self) => ({
    get isOutOfMoves() {
      return self.moves.current >= self.moves.max;
    },
    get head() {
      return self.parts[0];
    },
  }))
  .actions((self) => ({
    move(location) {
      if (self.isOutOfMoves) {
        return;
      }

      self.parts.unshift(location);
      self.parts = self.parts.slice(0, self.maxLength);
      self.moves.current += 1;
    },
    resetForNewTurn() {
      self.moves.current = 0;
    },
    isHeadLocation(location) {
      if (!self.head) {
        return false;
      }

      return compareLocations(location, self.head);
    },
    getValidMoveLocations(grid) {
      if (self.isOutOfMoves) {
        return [];
      }

      return grid.getEmptyNeighbors(self.head);
    },
    canUnitMoveToLocation(grid, location) {
      const validMoves = self.getValidMoveLocations(grid);

      return validMoves.some((moveLocation) =>
        compareLocations(moveLocation, location)
      );
    },
  }));

export default Unit;
