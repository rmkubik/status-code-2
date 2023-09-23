import { typecheck, types } from "mobx-state-tree";
import UnitData from "./UnitData";
import unitFiles from "../../data/units/*.js";
import UnitLevelData from "./UnitLevelData";

const UnitFactory = types
  .model({
    unitData: types.optional(types.array(UnitData), []),
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
          self.unitData[key] = unitData;
        });
    },
    create(unitLevelData) {
      try {
        typecheck(UnitLevelData, unitLevelData);
      } catch (error) {
        console.log("Failed to create unit from level data: ", error);
        return;
      }

      const { type, ...unitArgs } = unitLevelData;

      return self.unitData[type].createUnit(unitArgs);
    },
  }));

export default UnitFactory;
