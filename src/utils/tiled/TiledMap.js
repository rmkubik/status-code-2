import { constructMatrix } from "functional-game-utils";
import { types } from "mobx-state-tree";
import TiledTilesetFile from "./TiledTilesetFile";
import TiledMapFile from "./TiledMapFile";
import { Tile as TileModel } from "../../models/Grid";

const TiledMap = types
  .model({
    map: TiledMapFile,
    tileset: TiledTilesetFile,
  })
  .views((self) => ({
    getServer(location) {
      const server = self.map.serversLayer.getLocation(location);

      if (!server) {
        return;
      }

      const tileId = self.map.getTileIdFromGid(server.gid);

      const levelProperty =
        server.properties?.find((property) => property.name === "level") ?? {};
      const levelKey = levelProperty.value;

      return {
        location,
        spriteLocation: self.tileset.getSpriteLocationFromTileId(tileId),
        levelKey,
      };
    },
    getConnection(location) {
      const connection = self.map.connectionsLayer.getLocation(location);

      if (!connection) {
        return;
      }

      const tileId = self.map.getTileIdFromGid(connection);

      const properties = self.tileset.getPropertiesForTileId(tileId);
      const connections = {
        up: properties["connect-up"] ?? false,
        down: properties["connect-down"] ?? false,
        left: properties["connect-left"] ?? false,
        right: properties["connect-right"] ?? false,
      };

      return {
        location,
        spriteLocation: self.tileset.getSpriteLocationFromTileId(tileId),
        connections,
      };
    },
    createGameTiles() {
      console.log({ map: self.map, tileset: self.tileset });

      const tiles = constructMatrix((location) => {
        const server = self.getServer(location);
        if (server) {
          return TileModel.create({ icon: "1", ...server });
        }

        const connection = self.getConnection(location);
        if (connection) {
          return TileModel.create({
            icon: "2",
            ...connection,
          });
        }

        return TileModel.create({ icon: "." });
      }, self.map.dimensions);

      return tiles;

      // const connections = map.layers.find(layer => layer.name === 'connections');
      // connections.data
      //

      // console.log(self.convertGidToTileId(33));
      // console.log(self.getPropertiesForTileId(self.convertGidToTileId(33)));
      // console.log(self.convertTileIdToLocation(self.convertGidToTileId(33)));
    },
  }));

export default TiledMap;
export { TiledMapFile, TiledTilesetFile };
