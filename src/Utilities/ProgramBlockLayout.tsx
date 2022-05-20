import React from "react";

import {
  ConditionalBlock,
  ForLoopBlock,
  FunctionBlock,
  DeclarationBlock,
  WhileLoopBlock,
} from "../Modules/ProgramBlocks";
import DRErrors from "../Errors";
import { ButchObj } from "../Butch/ButchObj";
import { ButchCodes } from "../types/Types";

const hashProgramBlocks = new Map();

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
  // expression: ,
  // return:,
  // break:,
  // log:,
  while: WhileLoopBlock,
  for: ForLoopBlock,
  if: ConditionalBlock,
  // container:,
  // set:,
  // print:
} as const;

function decodeCodes(codes: ButchCodes) {
  const codesMap = new Map();
  
}

export default function createProgramBlock(item: ButchObj): JSX.Element {
  if (item.content === undefined) return DRErrors.unexpectedUndefined("item.content");
  const type: string = item.get("type");
  return React.createElement(ProgramBlocks[type]);
}
