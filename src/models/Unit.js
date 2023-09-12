import { types } from "mobx-state-tree";
import Location from "./Location";

const Unit = types
  .model({
    tailIcon: types.string,
    headIcon: types.string,
    location: Location,
    parts: types.array(Location),
    maxLength: types.number,
    name: types.string,
    moves: types.model({
      current: types.optional(types.number, 0),
      max: types.number,
    }),
    actions: types.array(
      types.model({
        name: types.string,
        range: types.number,
        damage: types.number,
      })
    ),
  })
  .actions((self) => ({
    move(location) {
      self.parts.unshift(location);
      self.parts = self.parts.slice(0, self.maxLength);
    },
  }));

export default Unit;
