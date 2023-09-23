import { getSnapshot, typecheck, types } from "mobx-state-tree";
import UnitData from "./UnitData";
import unitFiles from "../../data/units/*.js";
import UnitLevelData from "./UnitLevelData";

const UnitFactory = types
  .model("UnitFactory", {
    unitData: types.map(UnitData),
  })
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

      try {
        unitLevelData = UnitLevelData.create(unitLevelDataRaw);
      } catch (error) {
        console.error("Failed to create unit from level data: ", error);
        return;
      }

      const { type, ...unitArgs } = getSnapshot(unitLevelData);

      return self.unitData.get(type).createUnit(unitArgs);
    },
  }));

export default UnitFactory;
