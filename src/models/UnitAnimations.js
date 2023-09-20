import { flow, getSnapshot, types } from "mobx-state-tree";
import animationFiles from "../css/animations/*.js";
import reduceEntries from "../utils/reduceEntries.js";
import Location from "./Location.js";
import wait from "../utils/wait.js";
import { compareLocations, generateUuid } from "functional-game-utils";
import { remove } from "ramda";

const animationDurationEntries = Object.entries(animationFiles).map(
  ([key, value]) => [key, value.duration]
);
const animationDurations = reduceEntries(animationDurationEntries);

const UnitAnimation = types.model({
  part: Location,
  key: types.enumeration(Object.keys(animationDurations)),
  guid: types.string,
});

const UnitAnimations = types
  .model({
    anims: types.optional(types.array(UnitAnimation), []),
  })
  .views((self) => ({
    getFirstAnimationForLocation(location) {
      return self.anims.find((anim) => compareLocations(location, anim.part));
    },
  }))
  .actions((self) => ({
    start: flow(function* start({ key, part }) {
      const guid = generateUuid();
      self.anims.push({ key, part, guid });

      yield wait(animationDurations[key]);

      self.remove(guid);
    }),
    remove(guid) {
      const targetIndex = self.anims.findIndex((anim) => anim.guid === guid);

      self.anims = remove(targetIndex, 1, self.anims);
    },
  }));

export default UnitAnimations;
