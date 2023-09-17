import { constructMatrix } from "functional-game-utils";
import { onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";

const RootModel = types
  .model({
    grid: Grid,
    game: Game,
  })
  .actions((self) => ({
    endTurn() {
      self.game.advanceTurnCount();
      self.grid.resetUnitsForNewTurn();
    },
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
    headIcon: "X",
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
    actions: [
      {
        name: "Block",
        range: 1,
        damage: 2,
      },
    ],
    owner: 1,
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
