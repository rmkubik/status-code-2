import React from "react";
import { useRootStore } from "../models/Root";
import tiles from "../../data/art/tiles.png";
import Sprite from "./Sprite";

// mode = view or deployment
const MyPrograms = ({ mode = "view", selectedLocation }) => {
  const { inventory, unitFactory, grid } = useRootStore();
  const canDeploy =
    selectedLocation &&
    grid.isDeployLocation(selectedLocation) &&
    !grid.isUnitAtLocation(selectedLocation);

  return (
    <>
      <h2>My Programs</h2>
      <ul>
        {inventory.units.map((unitKey, index) => {
          const unit = unitFactory.getUnitData(unitKey);

          return (
            <li key={unitKey + index}>
              <Sprite src={tiles} location={unit.headSprite} /> - {unit.name}{" "}
              {mode === "deployment" && (
                <button
                  disabled={!canDeploy}
                  onClick={() => {
                    console.log({ unit });
                    grid.createUnit({
                      ...unit,
                      type: unitKey,
                      location: selectedLocation,
                      owner: 0,
                    });
                  }}
                >
                  Deploy
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default MyPrograms;
