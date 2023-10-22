import React from "react";
import isLevelIcon from "../utils/levels/isLevelIcon";
import { useRootStore } from "../models/Root";
import Row from "./Row";
import { getLocation } from "functional-game-utils";

const ServerInfo = ({ selected, tiles }) => {
  const { startBattle, levelLoader, saveData } = useRootStore();

  const selectedTile = selected && getLocation(tiles, selected);
  let isValidLevelSelected = false;

  if (selectedTile) {
    if (selectedTile.levelKey && levelLoader.has(selectedTile.levelKey)) {
      isValidLevelSelected = true;
    }
  }

  return (
    <div>
      <h2>Server Info</h2>
      <p style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        WHOIS:{" "}
        {selectedTile &&
        selectedTile.levelKey &&
        levelLoader.getWhois(selectedTile.levelKey)
          ? levelLoader.getWhois(selectedTile.levelKey)
          : "???"}
      </p>
      <Row style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        <div>
          {selectedTile &&
          selectedTile.levelKey &&
          saveData.isCompleted(selectedTile.levelKey)
            ? "200"
            : selectedTile && !levelLoader.has(selectedTile.levelKey)
            ? "404"
            : "401"}
        </div>
        <div>
          {selectedTile && levelLoader.has(selectedTile.levelKey)
            ? levelLoader.getName(selectedTile.levelKey)
            : "Not Found"}
        </div>
      </Row>
      <button
        disabled={!isValidLevelSelected}
        onClick={() => {
          if (selectedTile.levelKey) {
            startBattle(selectedTile.levelKey);
          }
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default ServerInfo;
