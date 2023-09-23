import {
  compareLocations,
  getCrossDirections,
  getNeighbors,
  isLocationInBounds,
} from "functional-game-utils";
import { getParentOfType, types } from "mobx-state-tree";
import Unit from "./Unit";
import isTruthy from "../utils/isTruthy";
import { RootModel } from "./Root";

export const Tile = types
  .model({
    icon: types.string,
  })
  .views((self) => ({
    getNeighbors() {
      /**
       * TODO:
       *
       * Interesting! Tile doesn't actually know
       * where it is located!
       *
       * There's no way to pass through this
       * getNeighbors function back up to the
       * parent right now!
       */
      const grid = getParentOfType(self, Grid);
      return grid.getNeighbors();
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
      if (!location) {
        return undefined;
      }

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
    isUnitAtLocation(location) {
      const unit = self.getUnitAtLocation(location);

      return isTruthy(unit);
    },
    getNeighbors(location) {
      const neighbors = getNeighbors(getCrossDirections, self.tiles, location);
      const validLocations = neighbors.filter((neighborLocation) => {
        return isLocationInBounds(self.tiles, neighborLocation);
      });

      return validLocations;
    },
    getEmptyNeighbors(location) {
      const neighborLocations = self.getNeighbors(location);
      const noUnitLocations = neighborLocations.filter((neighborLocation) => {
        return !self.getUnitAtLocation(neighborLocation);
      });

      return noUnitLocations;
    },
    getUnitsByOwner(owner) {
      return self.units.filter((unit) => unit.owner === owner);
    },
  }))
  .actions((self) => ({
    resetUnitsForNewTurn() {
      self.units.forEach((unit) => unit.resetForNewTurn());
    },
    createUnit({ location, owner, type, otherParts }, unitFactory) {
      if (!unitFactory) {
        unitFactory = getParentOfType(self, RootModel).unitFactory;
      }

      const newUnit = unitFactory.create({ location, owner, type, otherParts });

      self.units.push(newUnit);
    },
  }));

export default Grid;
