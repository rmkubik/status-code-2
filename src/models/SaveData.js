import { types } from "mobx-state-tree";

const LevelSaveData = types
  .model("LevelSaveData", {
    isCompleted: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    markCompleted() {
      self.isCompleted = true;
    },
  }));

const SaveData = types
  .model("SaveData", {
    levels: types.map(LevelSaveData),
  })
  .views((self) => ({
    isCompleted(key) {
      return self.levels.get(key)?.isCompleted ?? false;
    },
  }))
  .actions((self) => ({
    markCompleted(key) {
      let level = self.levels.get(key);

      if (!level) {
        level = LevelSaveData.create({});
        self.levels.set(key, level);
      }

      level.markCompleted();
    },
  }));

export default SaveData;
