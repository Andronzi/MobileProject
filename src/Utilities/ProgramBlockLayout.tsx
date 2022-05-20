import React from "react";

import {
  ConditionalBlock,
  ForLoopBlock,
  FunctionBlock,
  DeclarationBlock,
  WhileLoopBlock,
<<<<<<< HEAD
  ExpressionBlock,
  ReturnBlock,
  PrintBlock,
} from "../modules/ProgramBlocks.d";

=======
} from "../Modules/ProgramBlocks.d";
>>>>>>> 552c797f8e3ff95ac3bb75f812d85cc2bcb9eda1
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
