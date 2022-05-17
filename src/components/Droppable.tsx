import React from "react";
import PropTypes from "prop-types";

import { FlatList } from "react-native";
import { ButchObj } from "src/Butch/ButchObj";
import createProgramBlock from "src/Utilities/ProgramBlockLayout";

declare interface DroppableProps {
  content: ButchObj[];
}

function Droppable({ content }: DroppableProps) {
  return <FlatList data={content} renderItem={item => createProgramBlock(item.item)} />;
}

Droppable.propTypes = {
  items: PropTypes.array,
};

export default Droppable;
