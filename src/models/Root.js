import {
  constructMatrix,
  constructMatrixFromTemplate,
} from "functional-game-utils";
import { flow, getSnapshot, onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";
import wait from "../utils/wait";
import Inventory from "./Inventory";
import UnitFactory from "./UnitFactory";

function isInt(string) {
  const result = parseInt(string, 10);

  return !isNaN(result);
}

function createGridFromLevel(level, unitFactory) {
  const units = [];

  const tiles = constructMatrixFromTemplate((char, location) => {
    let icon = char;

    if (isInt(char)) {
      // This is a unit spawn location
      units.push({
        location,
        ...level.units[parseInt(char)],
      });
      // After handling unit, mark tile as empty.
      icon = ".";
    }

    return {
      icon,
    };
  }, level.tiles);

  const grid = Grid.create({
    tiles,
    units: [],
  });

  units.forEach((unit) => {
    grid.createUnit(unit, unitFactory);
  });

  return grid;
}

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
    scene: types.enumeration(["mainMenu", "map", "battleIntro", "battle"]),
  })
  .actions((self) => ({
    changeScene(newScene) {
      self.scene = newScene;
    },
    startBattle(level) {
      self.grid = createGridFromLevel(level, self.unitFactory);

      self.changeScene("battleIntro");
    },
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
  scene: "mainMenu",
});

initialState.unitFactory.loadUnitFiles();

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
