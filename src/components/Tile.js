import { compareLocations } from "functional-game-utils";
import React from "react";
import styled from "styled-components";
import { useRootStore } from "../models/Root";

const TileContainer = styled.div`
  border: ${(props) =>
    props.isSelected ? "1px dashed black" : "1px dashed transparent"};
`;

const Tile = ({ tile, location, isSelected, isMoveTarget, onClick }) => {
  const { grid } = useRootStore();

  const unitOnTile = grid.getUnitAtLocation(location);
  const isHead = unitOnTile && compareLocations(unitOnTile.parts[0], location);

  let tileIcon = tile.icon;

  if (unitOnTile) {
    if (isHead) {
      tileIcon = unitOnTile.headIcon;
    } else {
      tileIcon = unitOnTile.tailIcon;
    }
  }

  if (isMoveTarget) {
    tileIcon = "+";
  }

  return (
    <TileContainer isSelected={isSelected} onClick={onClick}>
      {tileIcon}
    </TileContainer>
  );
};

export default Tile;
