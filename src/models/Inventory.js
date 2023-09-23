import { types } from "mobx-state-tree";
import Unit from "./Unit";

const Inventory = types.model("Inventory", {
  units: types.optional(types.array(Unit), []),
});

export default Inventory;
