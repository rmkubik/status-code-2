import { types } from "mobx-state-tree";

// TODO:
//
// Different behavior models for units
// - Randomly move
// - Move toward nearest player unit
// - Move away from nearest player unit
// - Move toward/away specific unit
// - Move toward/away specific location
// - Move toward/away healthiest player unit
// - Move toward/away weakest player unit
//
// Action usage behavior models
// - Attack random in range player unit
// - Attack healthiest in range player unit
// - Attack weakest in range player unit
// - NON ATTACK actions

const EnemyBrain = types
  .model({
    movementStrategy: types.optional(
      types.enumeration(["random", "towardNearestPlayerUnit"]),
      "random"
    ),
    actionStrategy: types.optional(types.enumeration(["random"]), "random"),
  })
  .actions((self) => ({
    getMoveTarget() {},
    getActionTarget() {},
  }));

export default EnemyBrain;
