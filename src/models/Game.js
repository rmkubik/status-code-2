import { types } from "mobx-state-tree";

const Game = types
  .model("Game", {
    currentTurn: types.optional(types.number, 0),
    playerNumber: types.literal(0),
    selectedActionIndex: types.optional(types.number, -1),
  })
  .actions((self) => ({
    advanceTurnCount() {
      self.currentTurn += 1;
    },
    isPlayerNumber(playerNumber) {
      return playerNumber === self.playerNumber;
    },
    setSelectedActionIndex(newIndex) {
      self.selectedActionIndex = newIndex;
    },
  }));

export default Game;
