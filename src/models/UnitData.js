import { getParent, getSnapshot, types } from "mobx-state-tree";
import Unit from "./Unit";
import Action from "./Action";
import EnemyBrain from "./EnemyBrain";
import Location from "./Location";

const UnitData = types
  .model("UnitData", {
    headIcon: types.string,
    headSprite: Location,
    maxLength: types.number,
    name: types.string,
    moves: types.model({
      max: types.number,
    }),
    actions: types.array(Action),
    brain: types.maybe(EnemyBrain),
  })
  .actions((self) => ({
    createUnit({ location, owner, otherParts = [] }) {
      const snapshot = getSnapshot(self);

      // console.log(getParent(self));

      return Unit.create({
        ...snapshot,
        parts: [location, ...otherParts],
        owner,
        actionsTaken: {},
      });
    },
  }));

export default UnitData;
