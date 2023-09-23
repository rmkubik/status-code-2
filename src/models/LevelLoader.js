import { types } from "mobx-state-tree";
import levelFiles from "../../data/levels/*.yaml";
import LevelData from "./LevelData";

const LevelLoader = types
  .model({
    levelData: types.map(LevelData),
  })
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
          self.levelData[key] = levelData;
        });
    },
    create(key) {
      return self.levelData[key].createGrid();
    },
  }));

export default LevelLoader;
