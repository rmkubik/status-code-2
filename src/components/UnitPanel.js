import React from "react";

const UnitPanel = ({ unit }) => {
  return (
    <div>
      <p>{unit?.name ?? "None Selected"}</p>
      <p>
        Length: {unit?.parts.length ?? "x"}/{unit?.maxLength ?? "x"}
      </p>
    </div>
  );
};

export default UnitPanel;
