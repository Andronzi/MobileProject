import React from "react";
import { FlatList } from "react-native";
import PropTypes from "prop-types";

import FunctionBlock from "../Components/Function";
import ReturnBlock from "../Components/ReturnBlock";
import ExpressionBlock from "../Components/Expression";
import ConditionalBlock from "../Components/ConditionalBlock";
import ForLoopBlock from "../Components/ForBlock";
import PrintBlock from "../Components/Print";
import DeclarationBlock from "../Components/Declare";
import useComponentData from "../hooks/useComponentData";

import DRErrors from "../Errors";
import { ButchObj } from "../Butch/ButchObj";

const ProgramBlocks: { [key: string]: React.FC<any> } = {
  declare: DeclarationBlock,
  function: FunctionBlock,
  // invoker:,
  // deref:,
  // type:,
  // name:,
  // nameSeq:,  // content:,
  // value:,
  // text:,
  expression: ExpressionBlock,
  return: ReturnBlock,
  // break:,
  // log:,
  // while: WhileLoopBlock,
  for: ForLoopBlock,
  if: ConditionalBlock,
  // container:,
  // set:,
  print: PrintBlock,
} as const;

export default function createProgramBlock(item: ButchObj): JSX.Element {
  console.log(item.type);
  return React.createElement(ProgramBlocks[item.type], { item });
}

declare interface DroppableProps {
  content: ButchObj[] | undefined;
}

export function Droppable({ content }: DroppableProps) {
  return (
    <FlatList
      scrollEnabled={false}
      contentContainerStyle={{ margin: 14 }}
      data={content}
      renderItem={item => {
        console.log(item.item.data);
        return createProgramBlock(item.item);
      }}
    />
  );
}

Droppable.propTypes = {
  items: PropTypes.array,
};
