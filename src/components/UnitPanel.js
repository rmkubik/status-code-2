import React from "react";

const UnitPanel = ({ unit }) => {
  return (
    <div>
      <p>{unit?.name ?? "None Selected"}</p>
      <p>
        Length: {unit?.parts.length ?? "?"}/{unit?.maxLength ?? "?"}
      </p>
      <p>
        Moves: {unit?.moves.current ?? "?"}/{unit?.moves.max ?? "?"}
      </p>
      <p>Actions</p>
      <ul>
        {unit?.actions.map((action) => (
          <li>
            {action.name} - {action.damage}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnitPanel;
