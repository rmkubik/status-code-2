import { compareLocations } from "functional-game-utils";
import React from "react";
import styled from "styled-components";
import { useRootStore } from "../models/Root";
import { observer } from "mobx-react-lite";

const getBgColor = (props) => {
  if (!props.isUnit) {
    return "";
  }

  switch (props.owner) {
    case 0:
      return "rgb(84, 84, 255)";
    case 1:
      return "rgb(255, 84, 84)";
    default:
      return "yellow";
  }
};

const TileContainer = styled.div`
  border: 1px solid transparent;

  border-top-color: ${(props) => (props.borders.up ? "transparent" : "black")};
  border-bottom-color: ${(props) =>
    props.borders.down ? "transparent" : "black"};
  border-left-color: ${(props) =>
    props.borders.left ? "transparent" : "black"};
  border-right-color: ${(props) =>
    props.borders.right ? "transparent" : "black"};

  border-color: ${(props) => (props.isUnit ? "" : "transparent")};

  border-style: ${(props) => (props.isSelected ? "dashed" : "")};
  border-color: ${(props) => (props.isSelected ? "white" : "")};

  color: ${(props) => (props.isMoveTarget ? "white" : "")};
  color: ${(props) => (props.isActionTarget ? "white" : "")};
  color: ${(props) => (props.isUnit ? "white" : "")};
  background-color: ${getBgColor};

  font-size: ${(props) => props.theme.tileFontSize}px;
`;

const Tile = observer(
  ({ tile, location, isSelected, isMoveTarget, isActionTarget, onClick }) => {
    const { grid } = useRootStore();

    const unitOnTile = grid.getUnitAtLocation(location);
    const isHead = unitOnTile && compareLocations(unitOnTile.head, location);

    let borders = {
      up: false,
      down: false,
      left: false,
      right: false,
    };
    let tileIcon = tile.icon;
    let className = "";

    if (unitOnTile) {
      if (isHead) {
        tileIcon = unitOnTile.headIcon;
      } else {
        tileIcon = "";
      }

      borders = unitOnTile.getPartBorders(location);

      const animation =
        unitOnTile.animations.getFirstAnimationForLocation(location);

      if (animation) {
        className += `animated ${animation.key} `;
      }
    }

    if (isMoveTarget) {
      tileIcon = "+";
    }

    if (isActionTarget) {
      tileIcon = "⚔";
    }

    return (
      <TileContainer
        isSelected={isSelected}
        isUnit={Boolean(unitOnTile)}
        borders={borders}
        owner={unitOnTile?.owner}
        isMoveTarget={isMoveTarget}
        isActionTarget={isActionTarget}
        onClick={onClick}
        className={className}
      >
        {tileIcon}
      </TileContainer>
    );
  }
);

export default Tile;
