import { getParentOfType, types } from "mobx-state-tree";
import { RootModel } from "./Root";

const Inventory = types
  .model("Inventory", {
    units: types.array(types.string),
  })
  .actions((self) => ({
    addUnit(key) {
      const { unitFactory } = getParentOfType(self, RootModel);

      if (unitFactory.isValidKey(key)) {
        return;
      }

      self.units.push(key);
    },
  }));

export default Inventory;
