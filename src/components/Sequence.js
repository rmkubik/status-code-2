import React from "react";
import Line from "./Line";
import arrayifyChildren from "../utils/react/arrayifyChildren";

function preProcessChildren({ children, flattenChildren }) {
  let processedChildren = arrayifyChildren(children);

  if (flattenChildren) {
    processedChildren = processedChildren.flat();
  }

  // Remove all children that
  // are not a Line React component
  processedChildren = processedChildren.filter((child) => {
    return child?.type === Line;
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

  const boundChildren = currentChildren.map((child) => {
    return React.cloneElement(child, {
      onFinished: () => {
        child.props.onFinished?.();
        onFinished();
      },
    });
  });

  return <div>{boundChildren}</div>;
};

export default Sequence;
