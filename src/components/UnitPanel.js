import React from "react";
import { useRootStore } from "../models/Root";

const UnitPanel = ({ unit, setCurrentActionIndex }) => {
  const { game } = useRootStore();

  return (
    <div>
      <p>{unit?.name ?? "None Selected"}</p>
      <p>
        Length: {unit?.parts.length ?? "?"}/{unit?.maxLength ?? "?"}
      </p>
      <p>
        Moves: {unit ? unit.moves.max - unit.moves.current : "?"}/
        {unit?.moves.max ?? "?"}
      </p>
      <p>Actions</p>
      <ul>
        {unit?.actions.map((action, index) => (
          <li key={action.name}>
            <button onClick={() => game.setSelectedActionIndex(index)}>
              {action.name} - {action.damage}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnitPanel;
