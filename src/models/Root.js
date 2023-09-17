import { constructMatrix } from "functional-game-utils";
import { flow, onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";
import pickRandomlyFromArray from "../utils/pickRandomlyFromArray";
import wait from "../utils/wait";

const RootModel = types
  .model({
    state: types.optional(
      types.enumeration(["playerActing", "enemyActing"]),
      "playerActing"
    ),
    grid: Grid,
    game: Game,
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

          if (!moveTarget) {
            break;
          }

          enemyUnit.move(moveTarget);

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

const units = [
  {
    location: { row: 3, col: 2 },
    headIcon: "@",
    tailIcon: "#",
    parts: [{ row: 3, col: 2 }],
    maxLength: 4,
    name: "Hack.sh",
    moves: {
      max: 2,
    },
    actionsTaken: {},
    actions: [
      {
        name: "Slash",
        range: 1,
        damage: 2,
      },
    ],
    owner: 0,
  },
  {
    location: { row: 7, col: 5 },
    headIcon: "@",
    tailIcon: "#",
    parts: [{ row: 7, col: 5 }],
    maxLength: 4,
    name: "Hack.sh",
    moves: {
      max: 2,
    },
    actionsTaken: {},
    actions: [
      {
        name: "Slash",
        range: 1,
        damage: 2,
      },
    ],
    owner: 0,
  },
  {
    location: { row: 8, col: 2 },
    headIcon: "█",
    tailIcon: "#",
    parts: [
      { row: 8, col: 2 },
      { row: 8, col: 3 },
      { row: 8, col: 4 },
    ],
    maxLength: 4,
    name: "Shield",
    moves: {
      max: 2,
    },
    actionsTaken: {},
    actions: [
      {
        name: "Block",
        range: 1,
        damage: 2,
      },
    ],
    owner: 1,
    brain: {
      movementStrategy: "towardNearestPlayerUnit",
    },
  },
  {
    location: { row: 0, col: 8 },
    headIcon: "█",
    tailIcon: "#",
    parts: [{ row: 0, col: 8 }],
    maxLength: 4,
    name: "Shield",
    moves: {
      max: 2,
    },
    actionsTaken: {},
    actions: [
      {
        name: "Block",
        range: 1,
        damage: 2,
      },
    ],
    owner: 1,
    brain: { movementStrategy: "towardNearestPlayerUnit" },
  },
];

let initialState = RootModel.create({
  grid: {
    tiles: initialTiles,
    units,
  },
  game: {
    playerNumber: 0,
  },
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
