import React, { useState } from "react";
import arrayifyChildren from "../utils/react/arrayifyChildren";
import Row from "./Row";
import styled from "styled-components";

const TabTitle = styled.div`
  border: 1px solid white;
  border-bottom-color: ${(props) => (props.isSelected ? "black" : "")};

  padding: 0.5rem;

  cursor: ${(props) => (props.isSelected ? "" : "pointer")};

  margin-bottom: -1px;
`;

const TabContainer = styled.div`
  border: 1px solid white;
`;

const Tab = ({ children, title }) => {
  return <TabContainer>{children}</TabContainer>;
};

const Tabs = ({ children }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const arrayifiedChildren = arrayifyChildren(children);
  const tabChildren = arrayifiedChildren.filter((child) => child?.type === Tab);

  return (
    <div>
      <Row>
        {tabChildren.map((tab, index) => (
          <TabTitle
            isSelected={index === selectedIndex}
            onClick={() => setSelectedIndex(index)}
          >
            {tab.props.title}
          </TabTitle>
        ))}
      </Row>
      {tabChildren[selectedIndex]}
    </div>
  );
};

Tabs.Tab = Tab;

export default Tabs;
