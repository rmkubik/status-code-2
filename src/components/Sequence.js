import React, { useEffect } from "react";
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

const Sequence = ({ children, flattenChildren, onFinished = () => {} }) => {
  const [currentChild, setCurrentChild] = React.useState(0);

  useEffect(() => {
    if (currentChild >= children.length - 1) {
      onFinished();
    }
  }, [currentChild, children.length]);

  useEffect(() => {
    // TODO:
    // This is buggy!
    //
    // It needs to immediately full type every child
    // and hide every NOT intentionally lingered cursor.
    //
    // I'm not 100% how we determine what the "final cursor" is
    // with the current set up...?
    const skipSequence = () => {
      setCurrentChild(children.length);
    };

    document.addEventListener("click", skipSequence);

    return () => document.removeEventListener("click", skipSequence);
  }, [children.length]);

  const onLineFinished = () => {
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
        onLineFinished();
      },
    });
  });

  return <div>{boundChildren}</div>;
};

export default Sequence;
