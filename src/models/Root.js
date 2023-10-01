import { constructMatrix } from "functional-game-utils";
import { flow, onSnapshot, types } from "mobx-state-tree";
import { createContext, useContext } from "react";
import Grid from "./Grid";
import Game from "./Game";
import wait from "../utils/wait";
import Inventory from "./Inventory";
import UnitFactory from "./UnitFactory";
import LevelLoader from "./LevelLoader";
import AsciiArtLoader from "./AsciiArtLoader";
import SaveData from "./SaveData";

const RootModel = types
  .model("Root", {
    grid: Grid,
    inventory: Inventory,
    game: Game,
    unitFactory: UnitFactory,
    levelLoader: LevelLoader,
    asciiArtLoader: AsciiArtLoader,
    scene: types.enumeration(["mainMenu", "map", "battleIntro", "battle"]),
    currentLevelKey: types.maybe(types.string),
    saveData: SaveData,
  })
  .actions((self) => ({
    changeScene(newScene) {
      self.scene = newScene;
    },
    startBattle(level) {
      self.game.reset();
      self.grid = self.levelLoader.create(level);
      self.currentLevelKey = level;

      self.changeScene("battleIntro");
    },
    endBattle() {
      if (self.game.state === "victory") {
        self.saveData.markCompleted(self.currentLevelKey);
      }

      self.changeScene("map");
      self.currentLevelKey = undefined;
    },
    replaceGrid(snapshot) {
      self.grid = Grid.create(snapshot);
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
  asciiArtLoader: {},
  scene: "mainMenu",
  saveData: {},
});

initialState.unitFactory.loadUnitFiles();
initialState.levelLoader.loadLevelFiles();
initialState.asciiArtLoader.loadFiles();

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
