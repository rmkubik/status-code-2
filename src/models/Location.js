import { types } from "mobx-state-tree";

const Location = types.model({
  row: types.number,
  col: types.number,
});

export default Location;
