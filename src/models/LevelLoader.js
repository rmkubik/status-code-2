import { types } from "mobx-state-tree";
import levelFiles from "../../data/levels/*.yaml";
import LevelData from "./LevelData";

const LevelLoader = types
  .model("LevelLoader", {
    levelData: types.map(LevelData),
  })
  .views((self) => ({
    has(key) {
      return self.levelData.has(key);
    },
    getName(key) {
      if (!self.has(key)) {
        console.warn(`Failed to getName for: ${key}`);
        return "";
      }

      return self.levelData.get(key).name;
    },
    getIntro(key) {
      if (!self.has(key)) {
        console.warn(`Failed to getIntro for: ${key}`);
        return [];
      }

      return self.levelData.get(key).getIntro();
    },
    getMapIcon(key) {
      if (!self.has(key)) {
        console.warn(`Failed to getMapIcon for: ${key}`);
        return {
          row: 6,
          col: 2,
        };
      }

      return self.levelData.get(key).parseMapIconLocation();
    },
    getWhois(key) {
      if (!self.has(key)) {
        console.warn(`Failed to getWhois for: ${key}`);
        return "";
      }

      return self.levelData.get(key).whois;
    },
  }))
  .actions((self) => ({
    loadLevelFiles() {
      Object.entries(levelFiles)
        .map(([key, levelFile]) => {
          try {
            return [key, LevelData.create(levelFile)];
          } catch (error) {
            console.error(`Failed to parse level data for: ${key}`, error);
          }
        })
        .forEach(([key, levelData]) => {
          self.levelData.set(key, levelData);
        });
    },
    create(key) {
      if (!self.levelData.get(key)) {
        console.error(`Failed to create level "${key}". Does not exist!`);
        return;
      }

      return self.levelData.get(key).createGrid();
    },
  }));

export default LevelLoader;
