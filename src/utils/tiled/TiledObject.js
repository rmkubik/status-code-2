import { types } from "mobx-state-tree";

const TiledCustomStringProperty = types.model({
  name: types.string,
  type: types.literal("string"),
  value: types.string,
});

const TiledCustomIntProperty = types.model({
  name: types.string,
  type: types.literal("int"),
  value: types.number,
});

const TiledCustomProperty = types.union(
  TiledCustomStringProperty,
  TiledCustomIntProperty
);

const TiledObject = types
  .model({
    gid: types.number,
    id: types.number,
    name: types.string,
    type: types.string,
    height: types.number,
    width: types.number,
    x: types.number,
    y: types.number,
    properties: types.array(TiledCustomProperty),
  })
  .views((self) => ({
    get point() {
      return {
        x: self.x,
        y: self.y,
      };
    },
  }));

export default TiledObject;
