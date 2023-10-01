import React from "react";
import { useRootStore } from "../models/Root";

const DevPanel = () => {
  const { levelLoader, saveData } = useRootStore();

  return (
    <div>
      <div>
        <h2>Levels</h2>
        <ul>
          {Array.from(levelLoader.levelData.entries()).map(
            ([levelKey, levelData]) => (
              <li>
                {levelKey}{" "}
                <button onClick={() => saveData.markCompleted(levelKey)}>
                  Complete
                </button>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default DevPanel;
