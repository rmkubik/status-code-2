import React from "react";
import { useRootStore } from "../models/Root";
import tiles from "../../data/art/tiles.png";
import Sprite from "./Sprite";
import styled from "styled-components";

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  canvas {
    image-rendering: pixelated;
    height: 40px;
    width: 40px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  *:not(:last-child) {
    margin-right: 1rem;
  }
`;

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
      <List>
        {inventory.units.map((unitKey, index) => {
          const unit = unitFactory.getUnitData(unitKey);

          return (
            <li key={unitKey + index}>
              <Row>
                <Sprite src={tiles} location={unit.headSprite} />
                <div>{unit.name}</div>
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
              </Row>
            </li>
          );
        })}
      </List>
    </>
  );
};

export default MyPrograms;
