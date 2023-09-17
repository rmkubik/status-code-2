import { getParentOfType, getSnapshot, types } from "mobx-state-tree";
import Location from "./Location";
import { compareLocations } from "functional-game-utils";
import addLocations from "../utils/addLocations";
import { RootModel } from "./Root";

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
    owner: types.number,
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
    isPartAtLocation(location) {
      return self.parts.some((part) => compareLocations(part, location));
    },
    getPartBorders(location) {
      if (!self.isPartAtLocation(location)) {
        return {};
      }

      const up = { row: -1, col: 0 };
      const down = { row: 1, col: 0 };
      const left = { row: 0, col: -1 };
      const right = { row: 0, col: 1 };

      const upLocation = addLocations(location, up);
      const downLocation = addLocations(location, down);
      const leftLocation = addLocations(location, left);
      const rightLocation = addLocations(location, right);

      return {
        up: self.isPartAtLocation(upLocation),
        down: self.isPartAtLocation(downLocation),
        left: self.isPartAtLocation(leftLocation),
        right: self.isPartAtLocation(rightLocation),
      };
    },
    isPlayerOwned() {
      const root = getParentOfType(self, RootModel);

      return root.game.isPlayerNumber(self.owner);
    },
  }));

export default Unit;
