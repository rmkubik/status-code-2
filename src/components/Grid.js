import React from "react";
import { getDimensions, mapMatrix } from "functional-game-utils";
import styled from "styled-components";
import { observer } from "mobx-react-lite";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    `${props.theme.tileSize}px `.repeat(props.width)};
  line-height: ${(props) => `${props.theme.tileSize}px`};
  text-align: center;
  cursor: pointer;
  user-select: none;

  color: #333333;
`;

const Grid = observer(({ tiles, renderTile = () => {} }) => {
  const { width } = getDimensions(tiles);

  return (
    <GridContainer
      width={width}
      onContextMenu={(event) => event.preventDefault()}
    >
      {mapMatrix((tile, location) => renderTile(tile, location), tiles)}
    </GridContainer>
  );
});

export default Grid;
