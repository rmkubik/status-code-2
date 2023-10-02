function arrayifyChildren(children) {
  let arrayified;

  /**
   * Children is not always type array. If it is an
   * object or string then we surround it in an array.
   */
  if (Array.isArray(children)) {
    // Make a copy of array so we don't modify a prop
    arrayified = [...children];
  } else {
    arrayified = [children];
  }

  return arrayified;
}

export default arrayifyChildren;
