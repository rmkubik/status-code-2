import { constructMatrix } from "functional-game-utils";
import { flow, onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";
import wait from "../utils/wait";
import Inventory from "./Inventory";
import UnitFactory from "./UnitFactory";
import LevelLoader from "./LevelLoader";

const RootModel = types
  .model("Root", {
    state: types.optional(
      types.enumeration(["playerActing", "enemyActing"]),
      "playerActing"
    ),
    grid: Grid,
    inventory: Inventory,
    game: Game,
    unitFactory: UnitFactory,
    levelLoader: LevelLoader,
    scene: types.enumeration(["mainMenu", "map", "battleIntro", "battle"]),
  })
  .actions((self) => ({
    changeScene(newScene) {
      self.scene = newScene;
    },
    startBattle(level) {
      self.game.reset();
      self.grid = self.levelLoader.create(level);

      self.changeScene("battleIntro");
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

let initialState = RootModel.create({
  grid: {
    tiles: initialTiles,
    units: [],
  },
  game: {
    playerNumber: 0,
  },
  inventory: {
    units: ["hack", "hack"],
  },
  unitFactory: {},
  levelLoader: {},
  scene: "mainMenu",
});

initialState.unitFactory.loadUnitFiles();
initialState.levelLoader.loadLevelFiles();

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
