import {
  detach,
  flow,
  getParentOfType,
  getSnapshot,
  types,
} from "mobx-state-tree";
import Grid from "./Grid";
import { RootModel } from "./Root";
import wait from "../utils/wait";

// TODO:
// We need to track a bit more information
// to entirely undo an action safely.
//
// All random actions, aka enemy choices
// need to be deterministic.
//
// Persist RNG seed across undos?
//
// Reset any non-grid turn data as well.
// Like turn count and gameState.
const EndTurn = types.model({
  type: types.literal("endTurn"),
  preActionGridSnapshot: types.frozen(Grid),
});
const TakeUnitMove = types.model({
  type: types.literal("takeUnitMove"),
  preActionGridSnapshot: types.frozen(Grid),
});
const TakeUnitAction = types.model({
  type: types.literal("takeUnitAction"),
  preActionGridSnapshot: types.frozen(Grid),
});
const PlayerAction = types.union({}, EndTurn, TakeUnitMove, TakeUnitAction);

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
    actions: types.optional(types.array(PlayerAction), []),
    energy: types.model({
      current: types.optional(types.number, 0),
      max: types.optional(types.number, 4),
    }),
  })
  .views((self) => ({
    get isPlayerOutOfEnergy() {
      return self.energy.current <= 0;
    },
  }))
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
    resetEnergy() {
      self.energy.current = self.energy.max;
    },
    reset() {
      self.currentTurn = 0;
      self.selectedActionIndex = -1;
      self.state = "deployment";
      self.resetEnergy();
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
    trackPlayerAction({ type }) {
      const { grid } = getParentOfType(self, RootModel);
      const action = PlayerAction.create({
        type,
        preActionGridSnapshot: getSnapshot(grid),
      });

      self.actions.push(action);
    },
    undoPlayerAction() {
      const root = getParentOfType(self, RootModel);

      // We do this instead of using .pop() because
      // mobx-state-tree doesn't like us using a node
      // after removing it from the tree if we don't
      // use the detatch function.
      const lastAction = self.actions[self.actions.length - 1];
      const action = detach(lastAction);

      if (action) {
        root.replaceGrid(action.preActionGridSnapshot);
      }
    },
    endTurn: flow(function* endTurn() {
      self.trackPlayerAction({ type: "endTurn" });

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
      self.resetEnergy();

      self.handleStateAfterEndTurn();
    }),
    spendEnergy() {
      self.energy.current -= 1;
    },
  }));

export default Game;
