import { types } from "mobx-state-tree";

const Location = types.model("Location", {
  row: types.number,
  col: types.number,
});

export default Location;
