import { compareLocations } from "functional-game-utils";
import React from "react";
import styled from "styled-components";
import { useRootStore } from "../models/Root";
import { observer } from "mobx-react-lite";
import Sprite from "./Sprite";
import tiles from "../../data/art/tiles.png";
import woodAxe from "../../data/art/wood-axe.svg";
import checkedShield from "../../data/art/checked-shield.svg";

// https://www.compart.com/en/unicode/block/U+2500
function isBoxDrawingChar(char) {
  const charCode = char.charCodeAt(0);

  return charCode >= 0x2500 && charCode <= 0x257f;
}

function isLevelIcon(icon) {
  return !isBoxDrawingChar(icon) && icon !== "." && icon !== "";
}

const getBgColor = (props) => {
  if (!props.isUnit) {
    if (props.isDeployLocation) {
      return "lightgray";
    }

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
  box-sizing: border-box;

  border: 2px solid transparent;

  border-color: black;
  border-top: ${(props) =>
    props.borders.up && !props.isSelected ? "none" : ""};
  padding-top: ${(props) =>
    props.borders.up && !props.isSelected ? "2px" : ""};
  border-bottom: ${(props) =>
    props.borders.down && !props.isSelected ? "none" : ""};
  padding-bottom: ${(props) =>
    props.borders.down && !props.isSelected ? "2px" : ""};
  border-left: ${(props) =>
    props.borders.left && !props.isSelected ? "none" : ""};
  padding-left: ${(props) =>
    props.borders.left && !props.isSelected ? "2px" : ""};
  border-right: ${(props) =>
    props.borders.right && !props.isSelected ? "none" : ""};
  padding-right: ${(props) =>
    props.borders.right && !props.isSelected ? "2px" : ""};

  border-color: ${(props) => (props.isUnit ? "" : "transparent")};

  border-style: ${(props) => (props.isSelected ? "dashed" : "")};
  border-color: ${(props) => (props.isSelected ? "white" : "")};

  color: ${(props) => (props.isMoveTarget ? "white" : "")};
  color: ${(props) => (props.isActionTarget ? "white" : "")};
  color: ${(props) => (props.isUnit ? "white" : "")};
  color: ${(props) => (props.isMapTile ? "white" : "")};
  color: ${(props) => (props.isCompleted ? props.theme.colors.success : "")};
  background-color: ${getBgColor};

  font-size: ${(props) => props.theme.tileFontSize}px;
  height: ${(props) => props.theme.tileSize}px;
  width: ${(props) => props.theme.tileSize}px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  /* padding: 3px; */

  canvas {
    image-rendering: pixelated;
    height: ${(props) => props.theme.tileSpriteHeight}px;
    width: ${(props) => props.theme.tileSpriteWidth}px;
  }
`;

const Tile = observer(
  ({
    tile,
    location,
    isSelected,
    isMoveTarget,
    isActionTarget,
    isMapTile,
    isDeployLocation,
    isCompleted,
    onClick,
  }) => {
    const { grid, levelLoader } = useRootStore();

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
      // TODO:
      // <Sprite src={tiles} color="error" />

      if (isHead) {
        tileIcon = <Sprite src={tiles} location={unitOnTile.headSprite} />;
        // tileIcon =
        //   unitOnTile.headIcon === "@" ? (
        //     <img src={woodAxe} />
        //   ) : (
        //     <img src={checkedShield} />
        //   );
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

    if (isMapTile) {
      if (tileIcon === ".") {
        tileIcon = "";
      } else if (isLevelIcon(tileIcon)) {
        tileIcon = (
          <Sprite
            src={tiles}
            location={levelLoader.getMapIcon(tileIcon)}
            color={isCompleted ? "success" : ""}
          />
        );
      }
    }

    return (
      <TileContainer
        isSelected={isSelected}
        isUnit={Boolean(unitOnTile)}
        borders={borders}
        owner={unitOnTile?.owner}
        isMoveTarget={isMoveTarget}
        isActionTarget={isActionTarget}
        isMapTile={isMapTile}
        isCompleted={isCompleted}
        isDeployLocation={isDeployLocation}
        onClick={onClick}
        className={className}
      >
        {tileIcon}
      </TileContainer>
    );
  }
);

export default Tile;
