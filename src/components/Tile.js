import { compareLocations } from "functional-game-utils";
import React from "react";
import styled from "styled-components";
import { useRootStore } from "../models/Root";
import { observer } from "mobx-react-lite";
import Sprite from "./Sprite";
import tiles from "../../data/art/tiles.png";
import woodAxe from "../../data/art/wood-axe.svg";
import checkedShield from "../../data/art/checked-shield.svg";

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
  color: ${(props) => (props.isMapTile ? "white" : "")};
  color: ${(props) => (props.isCompleted ? "green" : "")};
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
