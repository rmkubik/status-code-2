import { flow, getParentOfType, types } from "mobx-state-tree";
import Grid from "./Grid";
import { RootModel } from "./Root";
import wait from "../utils/wait";

const Game = types
  .model("Game", {
    currentTurn: types.optional(types.number, 0),
    playerNumber: types.literal(0),
    selectedActionIndex: types.optional(types.number, -1),
    state: types.optional(
      types.enumeration([
        "deployment",
        "playerActing",
        "enemyActing",
        "victory",
        "defeat",
      ]),
      "deployment"
    ),
  })
  .actions((self) => ({
    advanceTurnCount() {
      self.currentTurn += 1;
    },
    isPlayerNumber(playerNumber) {
      return playerNumber === self.playerNumber;
    },
    setSelectedActionIndex(newIndex) {
      self.selectedActionIndex = newIndex;
    },
    reset() {
      self.currentTurn = 0;
      self.selectedActionIndex = -1;
      self.state = "deployment";
    },
    handleStateAfterEndTurn() {
      // TODO:
      // Support other victory and loss conditions
      const { grid } = getParentOfType(self, RootModel);
      const isUnitAlive = (unit) => !unit.isDead;
      const livingPlayerUnits = grid.getUnitsByOwner(0).filter(isUnitAlive);
      const livingEnemyUnits = grid.getUnitsByOwner(1).filter(isUnitAlive);

      if (livingPlayerUnits.length === 0) {
        self.state = "defeat";
        return;
      }

      if (livingEnemyUnits.length === 0) {
        self.state = "victory";
        return;
      }

      self.state = "playerActing";
    },
    finishDeployment() {
      self.state = "playerActing";
    },
    endTurn: flow(function* endTurn() {
      const { grid } = getParentOfType(self, RootModel);

      self.state = "enemyActing";

      const enemyUnits = grid.getUnitsByOwner(1).filter((unit) => !unit.isDead);

      for (enemyUnit of enemyUnits) {
        let isUnitMoving = true;

        while (isUnitMoving) {
          const moveTarget = enemyUnit.getMoveTarget();

          if (moveTarget) {
            enemyUnit.move(moveTarget);
            yield wait(200);
          } else {
            const actionIndex = 0;
            const actionTarget = enemyUnit.getActionTarget(actionIndex);

            if (!actionTarget) {
              break;
            }

            yield enemyUnit.takeAction(actionIndex, actionTarget);
          }
        }
      }

      self.advanceTurnCount();
      self.setSelectedActionIndex(-1);
      grid.resetUnitsForNewTurn();

      self.handleStateAfterEndTurn();
    }),
  }));

export default Game;
