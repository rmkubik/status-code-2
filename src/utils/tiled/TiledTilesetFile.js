import { types } from "mobx-state-tree";

const TiledTilesetFile = types
  .model({
    // source image width in pixels
    imagewidth: types.number,
    // source image height in pixels
    imageheight: types.number,
    // width of a tile in pixels
    tilewidth: types.number,
    // height of a tile in pixels
    tileheight: types.number,
  })
  .views((self) => ({
    getLocationFromTileId(tileId) {
      const tileSetWidth = self.imagewidth / self.tilewidth;

      const row = Math.floor(tileId / tileSetWidth);
      const col = tileId % tileSetWidth;

      return { row, col };
    },
    getPropertiesForTileId(tileId) {
      const tile = this.tileset.tiles.find((tile) => tile.id === tileId);

      if (!tile.properties) {
        return {};
      }

      const properties = {};

      tile.properties.forEach((property) => {
        properties[property.name] = property.value;
      });

      return properties;
    },
    getSpriteLocationFromTileId(tileId) {
      const width = self.imagewidth / self.tilewidth;

      const row = Math.floor(tileId / width);
      const col = tileId % width;

      return { row, col };
    },
  }));

export default TiledTilesetFile;
