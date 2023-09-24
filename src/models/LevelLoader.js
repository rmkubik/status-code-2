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
      return self.levelData.get(key).name;
    },
    getIntro(key) {
      return self.levelData.get(key).getIntro();
    },
  }))
  .actions((self) => ({
    loadLevelFiles() {
      Object.entries(levelFiles)
        .map(([key, levelFile]) => {
          try {
            console.log({ levelFile });
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
