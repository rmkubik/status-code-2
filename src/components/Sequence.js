import React from "react";

const Sequence = ({ children, flattenChildren }) => {
  const [currentChild, setCurrentChild] = React.useState(0);

  const onFinished = () => {
    setCurrentChild((prevCurrentChild) => prevCurrentChild + 1);
    // document.body.scrollTop = document.body.scrollHeight;
  };

  /**
   * Children is not always type array. If it is an
   * object or string then we surround it in an array.
   */
  const childrenForcedArray =
    typeof children !== "array" ? [children] : children;

  const preProcessedChildren = flattenChildren
    ? childrenForcedArray.flat()
    : childrenForcedArray;

  const currentChildren = preProcessedChildren.slice(0, currentChild + 1);

  const boundChildren = React.Children.map(currentChildren, (child) => {
    return React.cloneElement(child, {
      onFinished,
    });
  });

  return <div>{boundChildren}</div>;
};

export default Sequence;
