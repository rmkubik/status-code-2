import React from "react";
import { getDimensions, mapMatrix } from "functional-game-utils";
import styled from "styled-components";
import { useRootStore } from "../models/Root";
import { observer } from "mobx-react-lite";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    `${props.theme.tileSize}px `.repeat(props.width)};
  line-height: ${(props) => `${props.theme.tileSize}px`};
  text-align: center;
  cursor: pointer;
  user-select: none;
`;

const Grid = observer(({ renderTile = () => {} }) => {
  const { grid } = useRootStore();
  const { width } = getDimensions(grid.tiles);

  return (
    <GridContainer
      width={width}
      onContextMenu={(event) => event.preventDefault()}
    >
      {mapMatrix((tile, location) => renderTile(tile, location), grid.tiles)}
    </GridContainer>
  );
});

export default Grid;
