import { getParentOfType, types } from "mobx-state-tree";
import TiledObject from "./TiledObject";
import { compareLocations } from "functional-game-utils";
import addLocations from "../addLocations";

const TiledMapFileTileset = types.model({
  firstgid: types.number,
  source: types.string,
});

const TiledMapFileObjectLayer = types
  .model({
    name: types.string,
    type: types.literal("objectgroup"),
    objects: types.array(TiledObject),
  })
  .views((self) => ({
    getLocation(location) {
      const tiledMapFile = getParentOfType(self, TiledMapFile);

      return self.objects.find((object) => {
        const objectLocation = tiledMapFile.getLocationFromPoint(object.point);

        return compareLocations(location, objectLocation);
      });
    },
  }));

const TiledMapFileTileLayer = types
  .model({
    name: types.string,
    type: types.literal("tilelayer"),
    data: types.array(types.number),
  })
  .views((self) => ({
    getLocation(location) {
      const tiledMapFile = getParentOfType(self, TiledMapFile);
      const index = location.row * tiledMapFile.width + location.col;

      return self.data[index];
    },
  }));

const TiledMapFileLayer = types.union(
  TiledMapFileTileLayer,
  TiledMapFileObjectLayer
);

const TiledMapFile = types
  .model({
    // tiles wide
    width: types.number,
    // tiles high
    height: types.number,
    // width of tile in pixels
    tilewidth: types.number,
    // height of tile in pixels
    tileheight: types.number,
    // attached tilesets
    tilesets: types.array(TiledMapFileTileset),
    // map layers
    layers: types.array(TiledMapFileLayer),
  })
  .views((self) => ({
    getTileIdFromGid(gid) {
      // This is hardcoded to our only tileset right now
      const { firstgid } = self.tilesets.find(
        (tileset) => tileset.source === "tiles.json"
      );

      return gid - firstgid;
    },
    getLocationFromPoint({ x, y }) {
      // The origin of object tiles is in the lower left corner.
      //
      // This means an object in the upper left corner of the Tiled
      // map will have an x,y position of 0,16 and a converted
      // location of 1,0.
      //
      // We need to offset this adjustment here by subtracting the
      // the tileheight from the y position.

      const row = Math.floor((y - self.tileheight) / self.tileheight);
      const col = Math.floor(x / self.tilewidth);

      return { row, col };
    },
    getPointFromLocation({ row, col }) {
      const x = col * self.tilewidth;
      const y = row * self.tileheight;

      return { x, y };
    },
    get dimensions() {
      return {
        height: self.height,
        width: self.width,
      };
    },
    get serversLayer() {
      return self.layers.find((layer) => layer.name === "servers");
    },
    get connectionsLayer() {
      return self.layers.find((layer) => layer.name === "connections");
    },
    get startLocation() {
      const startServer = self.serversLayer.objects.find((object) => {
        if (!object.properties) {
          return false;
        }

        const isStartProperty = object.properties.find(
          (property) => property.name === "isStart"
        );

        if (!isStartProperty) {
          return false;
        }

        return isStartProperty.value;
      });

      if (!startServer) {
        console.warn("No starting location found in map.");
        return { row: 0, col: 0 };
      }

      return self.getLocationFromPoint(startServer.point);
    },
  }));

export default TiledMapFile;
