export default {
  headSprite: {
    row: 0,
    col: 7,
  },
  maxLength: 4,
  name: "Shield+",
  moves: {
    max: 1,
  },
  actions: [
    {
      name: "Block+",
      range: 1,
      damage: 2,
      shape: "cross",
    },
  ],
  brain: {
    movementStrategy: "towardNearestPlayerUnit",
    actionStrategy: "randomPlayerUnitInRange",
  },
};
