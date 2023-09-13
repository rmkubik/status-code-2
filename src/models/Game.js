import { types } from "mobx-state-tree";

const Game = types.model({
  currentTurn: types.optional(types.number, 0),
});

export default Game;
