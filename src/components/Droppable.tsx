import React from "react";
import PropTypes from "prop-types";
import { FlatList } from "react-native";

import { ButchObj } from "../Butch/ButchObj";
import createProgramBlock from "../Utilities/ProgramBlockLayout";

declare interface DroppableProps {
  content: ButchObj[] | undefined;
}

function Droppable({ content }: DroppableProps) {
  return (
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={{ margin: 14 }}
      data={content}
      renderItem={item => createProgramBlock(item.item)}
    />
  );
}

Droppable.propTypes = {
  items: PropTypes.array,
};

export default Droppable;
