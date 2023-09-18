import { constructMatrix } from "functional-game-utils";
import { flow, getSnapshot, onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";
import wait from "../utils/wait";
import Inventory from "./Inventory";
import UnitFactory from "./UnitFactory";

const RootModel = types
  .model({
    state: types.optional(
      types.enumeration(["playerActing", "enemyActing"]),
      "playerActing"
    ),
    grid: Grid,
    inventory: Inventory,
    game: Game,
    unitFactory: UnitFactory,
  })
  .actions((self) => ({
    endTurn: flow(function* endTurn() {
      self.state = "enemyActing";

      const enemyUnits = self.grid
        .getUnitsByOwner(1)
        .filter((unit) => !unit.isDead);

      for (enemyUnit of enemyUnits) {
        let isUnitMoving = true;

        while (isUnitMoving) {
          const moveTarget = enemyUnit.getMoveTarget();

          if (moveTarget) {
            enemyUnit.move(moveTarget);
          } else {
            const actionIndex = 0;
            const actionTarget = enemyUnit.getActionTarget(actionIndex);

            if (!actionTarget) {
              break;
            }

            enemyUnit.takeAction(actionIndex, actionTarget);
          }

          yield wait(200);
        }
      }

      self.game.advanceTurnCount();
      self.game.setSelectedActionIndex(-1);
      self.grid.resetUnitsForNewTurn();
      self.state = "playerActing";
    }),
  }));

const initialTiles = constructMatrix(
  () => {
    return {
      icon: ".",
    };
  },
  {
    width: 10,
    height: 10,
  }
);

let initialState = RootModel.create({
  grid: {
    tiles: initialTiles,
    units: [],
  },
  game: {
    playerNumber: 0,
  },
  inventory: {},
  unitFactory: {},
});

initialState.unitFactory.loadUnitFiles();
initialState.grid.createUnit({
  location: { row: 3, col: 2 },
  owner: 0,
  type: "hack",
});
initialState.grid.createUnit({
  location: { row: 7, col: 5 },
  owner: 0,
  type: "hack",
});
initialState.grid.createUnit({
  location: { row: 8, col: 2 },
  owner: 1,
  type: "shield",
  otherParts: [
    { row: 8, col: 3 },
    { row: 8, col: 4 },
  ],
});
initialState.grid.createUnit({
  location: { row: 0, col: 8 },
  owner: 1,
  type: "shield",
});

// if (process.browser) {
//   const data = localStorage.getItem("rootState");

//   if (data) {
//     const json = JSON.parse(data);

//     if (RootModel.is(json)) {
//       initialState = RootModel.create(json);
//     }
//   }
// }

const rootStore = initialState;

onSnapshot(rootStore, (snapshot) => {
  console.log("Snapshot: ", snapshot);

  // localStorage.setItem("rootState", JSON.stringify(snapshot));
});

const RootStoreContext = createContext(null);

const RootContextProvider = RootStoreContext.Provider;

function useRootStore() {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }

  return store;
}

export { rootStore, RootContextProvider, useRootStore, RootModel };
