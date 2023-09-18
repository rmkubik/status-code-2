import { types } from "mobx-state-tree";
import UnitData from "./UnitData";
import unitFiles from "../../data/units/*.js";

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
    create({ location, owner, type, otherParts }) {
      return self.unitData[type].createUnit({ location, owner, otherParts });
    },
  }));

export default UnitFactory;
