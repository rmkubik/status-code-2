export default {
  headIcon: "█",
  tailIcon: "#",
  maxLength: 4,
  name: "Shield",
  moves: {
    max: 2,
  },
  actions: [
    {
      name: "Block",
      range: 1,
      damage: 1,
    },
  ],
  brain: {
    movementStrategy: "towardNearestPlayerUnit",
    actionStrategy: "randomPlayerUnitInRange",
  },
};
