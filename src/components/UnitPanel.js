import React from "react";

const UnitPanel = ({ unit }) => {
  return (
    <div>
      <p>{unit?.name ?? "None Selected"}</p>
      <p>
        Length: {unit?.parts.length ?? "x"}/{unit?.maxLength ?? "x"}
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
