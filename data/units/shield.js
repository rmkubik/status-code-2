export default {
  headIcon: "█",
  headSprite: {
    row: 0,
    col: 6,
  },
  maxLength: 3,
  name: "Shield",
  moves: {
    max: 1,
  },
  actions: [
    {
      name: "Block",
      range: 1,
      damage: 1,
      shape: "cross",
    },
  ],
  brain: {
    movementStrategy: "towardNearestPlayerUnit",
    actionStrategy: "randomPlayerUnitInRange",
  },
};
