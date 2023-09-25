import React from "react";
import Line from "./Line";

function preProcessChildren({ children, flattenChildren }) {
  let processedChildren;

  /**
   * Children is not always type array. If it is an
   * object or string then we surround it in an array.
   */
  if (Array.isArray(children)) {
    // Make a copy of array so we don't modify a prop
    processedChildren = [...children];
  } else {
    processedChildren = [children];
  }

  if (flattenChildren) {
    processedChildren = processedChildren.flat();
  }

  processedChildren = processedChildren.filter((child) => {
    return child.type === Line;
  });

  return processedChildren;
}

const Sequence = ({ children, flattenChildren }) => {
  const [currentChild, setCurrentChild] = React.useState(0);

  const onFinished = () => {
    setCurrentChild((prevCurrentChild) => prevCurrentChild + 1);
    // document.body.scrollTop = document.body.scrollHeight;
  };

  const preProcessedChildren = preProcessChildren({
    children,
    flattenChildren,
  });

  const currentChildren = preProcessedChildren.slice(0, currentChild + 1);

  const boundChildren = React.Children.map(currentChildren, (child) => {
    return React.cloneElement(child, {
      onFinished,
    });
  });

  return <div>{boundChildren}</div>;
};

export default Sequence;
