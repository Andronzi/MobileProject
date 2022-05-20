import React from "react";

import {
  ConditionalBlock,
  ForLoopBlock,
  FunctionBlock,
  DeclarationBlock,
  WhileLoopBlock,
  ExpressionBlock,
  ReturnBlock,
  PrintBlock,
} from "../modules/ProgramBlocks.d";

import DRErrors from "../Errors";
import { ButchObj } from "../Butch/ButchObj";
import { ButchCodes } from "../types/Types";

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
  while: WhileLoopBlock,
  for: ForLoopBlock,
  if: ConditionalBlock,
  // container:,
  // set:,
  print: PrintBlock
} as const;

export default function createProgramBlock(item: ButchObj): JSX.Element {
  console.log(item.type);
  return React.createElement(ProgramBlocks[item.type]);
}
