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
    if (isLevelIcon(selectedTile.icon) && levelLoader.has(selectedTile.icon)) {
      isValidLevelSelected = true;
    }
  }

  return (
    <div>
      <h2>Server Info</h2>
      <p style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        WHOIS:{" "}
        {selectedTile &&
        isLevelIcon(selectedTile.icon) &&
        levelLoader.getWhois(selectedTile.icon)
          ? levelLoader.getWhois(selectedTile.icon)
          : "???"}
      </p>
      <Row style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>
        <div>
          {selectedTile &&
          isLevelIcon(selectedTile.icon) &&
          saveData.isCompleted(selectedTile.icon)
            ? "200"
            : selectedTile && !levelLoader.has(selectedTile.icon)
            ? "404"
            : "401"}
        </div>
        <div>
          {selectedTile && levelLoader.has(selectedTile.icon)
            ? levelLoader.getName(selectedTile.icon)
            : "Not Found"}
        </div>
      </Row>
      <button
        disabled={!isValidLevelSelected}
        onClick={() => {
          if (isLevelIcon(selectedTile.icon)) {
            startBattle(selectedTile.icon);
          }
        }}
      >
        Connect
      </button>
    </div>
  );
};

export default ServerInfo;
