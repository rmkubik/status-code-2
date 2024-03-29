import { getParentOfType, types } from "mobx-state-tree";
import Grid from "./Grid";
import { manhattanDistance } from "functional-game-utils";
import Unit from "./Unit";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import getLocationsOneStepCloser from "../utils/getLocationsOneStepCloser";
import isTruthy from "../utils/isTruthy";

// TODO:
//
// Different behavior models for units
// - Randomly move
// - Move toward nearest player unit
// - Move away from nearest player unit
// - Move toward/away specific unit
// - Move toward/away specific location
// - Move toward/away healthiest player unit
// - Move toward/away weakest player unit
//
// Action usage behavior models
// - Attack random in range player unit
// - Attack healthiest in range player unit
// - Attack weakest in range player unit
// - NON ATTACK actions

const EnemyBrain = types
  .model("EnemyBrain", {
    movementStrategy: types.optional(
      types.enumeration(["random", "towardNearestPlayerUnit"]),
      "random"
    ),
    actionStrategy: types.optional(
      types.enumeration(["randomPlayerUnitInRange"]),
      "randomPlayerUnitInRange"
    ),
  })
  .actions((self) => ({
    getMoveTarget() {
      const grid = getParentOfType(self, Grid);
      const unit = getParentOfType(self, Unit);

      const moveOptions = grid.getEmptyNeighbors(unit.head);

      if (unit.isOutOfMoves || moveOptions.length === 0) {
        return undefined;
      }

      let moveTarget;

      switch (self.movementStrategy) {
        default:
        case "random":
          moveTarget = pickRandomlyFromArray(moveOptions);
          break;
        case "towardNearestPlayerUnit":
          const playerUnits = grid.getUnitsByOwner(0);

          let shortestDistance = Number.MAX_SAFE_INTEGER;
          let shortestDistanceTargets = [];

          playerUnits.forEach((playerUnit) => {
            playerUnit.parts.forEach((part) => {
              const distanceToPart = manhattanDistance(part, unit.head);

              if (distanceToPart < shortestDistance) {
                shortestDistance = distanceToPart;
                // Override array to remove old shortestDistance targets
                shortestDistanceTargets = [part];
              } else if (distanceToPart === shortestDistance) {
                shortestDistanceTargets.push(part);
              }
            });
          });

          const potentialMoveOptions = shortestDistanceTargets
            .map((targetPart) =>
              getLocationsOneStepCloser(grid.tiles, unit.head, targetPart)
            )
            .flat()
            .filter((option) => !grid.isUnitAtLocation(option));

          moveTarget = pickRandomlyFromArray(potentialMoveOptions);
          break;
      }

      return moveTarget;
    },
    getActionTarget(actionIndex) {
      const grid = getParentOfType(self, Grid);
      const unit = getParentOfType(self, Unit);

      const action = unit.getAction(actionIndex);
      const locationsInRange = action.getLocationsInRange();

      const locationsInRangeWithPlayerUnits = locationsInRange.filter(
        (location) => {
          const unitAtLocation = grid.getUnitAtLocation(location);

          if (!unitAtLocation) {
            return false;
          }

          return unitAtLocation.owner === 0;
        }
      );

      if (unit.isOutOfActions || locationsInRangeWithPlayerUnits.length === 0) {
        return undefined;
      }

      let actionTarget;

      switch (self.actionStrategy) {
        default:
        case "randomPlayerUnitInRange":
          actionTarget = pickRandomlyFromArray(locationsInRangeWithPlayerUnits);
          break;
      }

      return actionTarget;
    },
  }));

export default EnemyBrain;
