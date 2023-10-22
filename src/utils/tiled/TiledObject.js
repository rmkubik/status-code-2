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

const TiledCustomBoolProperty = types.model({
  name: types.string,
  type: types.literal("bool"),
  value: types.boolean,
});

export const TiledCustomProperty = types.union(
  TiledCustomStringProperty,
  TiledCustomIntProperty,
  TiledCustomBoolProperty
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
    get propertiesObj() {
      return self.properties.reduce((propertiesObj, currentProperty) => {
        return {
          ...propertiesObj,
          [currentProperty.name]: currentProperty.value,
        };
      }, {});
    },
  }));

export default TiledObject;
