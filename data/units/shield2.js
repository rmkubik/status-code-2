export default {
  headIcon: "▯",
  tailIcon: "#",
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
