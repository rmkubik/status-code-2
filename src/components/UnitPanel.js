import React from "react";
import { useRootStore } from "../models/Root";

const getButtonClasses = ({ isSelected, isOutOfActions }) => {
  let classes = "";

  if (isSelected) {
    classes += "selected ";
  }

  if (isOutOfActions) {
    classes += "disabled ";
  }

  return classes;
};

const UnitPanel = ({ unit }) => {
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
      <p>
        Actions:{" "}
        {unit ? unit.actionsTaken.max - unit.actionsTaken.current : "?"}/
        {unit?.actionsTaken.max ?? "?"}
      </p>
      <ul>
        {unit?.actions.map((action, index) => (
          <li key={action.name}>
            <button
              className={getButtonClasses({
                isSelected: game.selectedActionIndex === index,
                isOutOfActions: unit?.isOutOfActions,
              })}
              onClick={() => {
                if (unit?.isOutOfActions) {
                  return;
                }

                if (game.selectedActionIndex === index) {
                  game.setSelectedActionIndex(-1);
                } else {
                  game.setSelectedActionIndex(index);
                }
              }}
            >
              {action.name} - {action.damage}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnitPanel;
