import { types } from "mobx-state-tree";

const Game = types
  .model({
    currentTurn: types.optional(types.number, 0),
  })
  .actions((self) => ({
    advanceTurnCount() {
      self.currentTurn += 1;
    },
  }));

export default Game;
