import { types } from "mobx-state-tree";
import Location from "./Location";

const UnitLevelData = types.model({
  location: types.maybe(Location),
  owner: types.number,
  type: types.string,
  otherParts: types.maybe(types.array(Location)),
});

export default UnitLevelData;
