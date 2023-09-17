import { getParentOfType, types } from "mobx-state-tree";
import Location from "./Location";
import { compareLocations } from "functional-game-utils";
import addLocations from "../utils/addLocations";
import { RootModel } from "./Root";
import Grid from "./Grid";
import EnemyBrain from "./EnemyBrain";
import Action from "./Action";

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
    actionsTaken: types.model({
      current: types.optional(types.number, 0),
      max: types.optional(types.number, 1),
    }),
    actions: types.array(Action),
    owner: types.number,
    brain: types.maybe(EnemyBrain),
  })
  .views((self) => ({
    get isOutOfMoves() {
      return self.moves.current >= self.moves.max;
    },
    get isOutOfActions() {
      return self.actionsTaken.current >= self.actionsTaken.max;
    },
    get isDead() {
      return self.parts.length === 0;
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

      const grid = getParentOfType(self, Grid);

      if (grid.isUnitAtLocation(location)) {
        // Do not move on top of another unit
        return;
      }

      self.parts.unshift(location);
      self.parts = self.parts.slice(0, self.maxLength);
      self.moves.current += 1;
    },
    resetForNewTurn() {
      self.moves.current = 0;
      self.actionsTaken.current = 0;
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
    getValidActionLocations(actionIndex) {
      return self.actions[actionIndex].getLocationsInRange();
    },
    canUnitActionAtLocation(location, actionIndex) {
      const validLocations = self.getValidActionLocations(actionIndex);

      return validLocations.some((validLocation) =>
        compareLocations(validLocation, location)
      );
    },
    isPartAtLocation(location) {
      return self.parts.some((part) => compareLocations(part, location));
    },
    getAdjacentParts(location) {
      // Which index is this location at in the parts array?
      // Get the 0, 1, or 2 parts adjacent to the location.
      const targetIndex = self.parts.findIndex((part) =>
        compareLocations(part, location)
      );

      // Location is not a part of this unit
      if (targetIndex === -1) {
        return [];
      }

      const parts = [];

      const prevIndex = targetIndex - 1;
      const nextIndex = targetIndex + 1;

      if (prevIndex >= 0 && prevIndex < self.parts.length) {
        parts.push(self.parts[prevIndex]);
      }

      if (nextIndex >= 0 && nextIndex < self.parts.length) {
        parts.push(self.parts[nextIndex]);
      }

      return parts;
    },
    isAdjacentPartAtLocation(locationA, locationB) {
      const adjacentParts = self.getAdjacentParts(locationA);

      return adjacentParts.some((part) => compareLocations(part, locationB));
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
        up: self.isAdjacentPartAtLocation(location, upLocation),
        down: self.isAdjacentPartAtLocation(location, downLocation),
        left: self.isAdjacentPartAtLocation(location, leftLocation),
        right: self.isAdjacentPartAtLocation(location, rightLocation),
      };
    },
    isPlayerOwned() {
      const root = getParentOfType(self, RootModel);

      return root.game.isPlayerNumber(self.owner);
    },
    takeDamage(damage) {
      self.parts = self.parts.slice(0, self.parts.length - damage);
    },
    getAction(actionIndex) {
      return self.actions[actionIndex];
    },
    takeAction(actionIndex, location) {
      if (self.isOutOfActions) {
        return;
      }

      const grid = getParentOfType(self, Grid);
      const action = self.getAction(actionIndex);

      // TODO:
      // Handle more advanced types of
      // action targeting and such here.

      const targetUnit = grid.getUnitAtLocation(location);
      targetUnit.takeDamage(action.damage);
      self.actionsTaken.current += 1;
    },
    getMoveTarget() {
      if (!self.brain) {
        return undefined;
      }

      return self.brain.getMoveTarget();
    },
    getActionTarget(actionIndex) {
      if (!self.brain) {
        return undefined;
      }

      return self.brain.getActionTarget(actionIndex);
    },
  }));

export default Unit;
