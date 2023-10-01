import { getSnapshot, isStateTreeNode, types } from "mobx-state-tree";
import UnitData from "./UnitData";
import unitFiles from "../../data/units/*.js";
import UnitLevelData from "./UnitLevelData";

const UnitFactory = types
  .model("UnitFactory", {
    unitData: types.map(UnitData),
  })
  .views((self) => ({
    get unitKeys() {
      return self.unitData.keys();
    },
    isValidKey(key) {
      return self.unitData.has(key);
    },
    getUnitData(key) {
      return self.unitData.get(key);
    },
  }))
  .actions((self) => ({
    loadUnitFiles() {
      Object.entries(unitFiles)
        .map(([key, unitFile]) => {
          try {
            return [key, UnitData.create(unitFile.default)];
          } catch (error) {
            console.error(`Failed to parse unit data for: ${key}`, error);
          }
        })
        .forEach(([key, unitData]) => {
          self.unitData.set(key, unitData);
        });
    },
    create(unitLevelDataRaw) {
      let unitLevelData;

      if (isStateTreeNode(unitLevelDataRaw.location)) {
        unitLevelDataRaw.location = getSnapshot(unitLevelDataRaw.location);
      }

      try {
        unitLevelData = UnitLevelData.create(unitLevelDataRaw);
      } catch (error) {
        console.error("Failed to create unit from level data: ", error);
        return;
      }

      const { type, ...unitArgs } = getSnapshot(unitLevelData);

      if (!self.isValidKey(type)) {
        console.error(`Tried to create unit with invalid key: "${type}"`);
        return;
      }

      return self.unitData.get(type).createUnit(unitArgs);
    },
  }));

export default UnitFactory;
