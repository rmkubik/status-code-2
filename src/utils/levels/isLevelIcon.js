import isBoxDrawingChar from "./isBoxDrawingChar";

function isLevelIcon(icon) {
  return !isBoxDrawingChar(icon) && icon !== ".";
}

export default isLevelIcon;
