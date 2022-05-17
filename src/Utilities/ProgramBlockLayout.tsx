import React from "react";

import {
  ConditionalBlock,
  ForLoopBlock,
  FunctionBlock,
  DeclarationBlock,
  WhileLoopBlock,
} from "../Modules/ProgramBlocks";
import { ButchObj } from "src/Butch/ButchObj";
import DRErrors from "src/Errors";

const ProgramKeywords = {
  declare: "declare",
  function: "function",
  invoker: "invoker",
  deref: "deref",
  type: "type",
  name: "name",
  nameSeq: "nameSeq",
  content: "content",
  value: "value",
  text: "text",
  expression: "expression",
  return: "return",
  break: "break",
  log: "log",
  while: "while",
  for: "for",
  if: "if",
  container: "container",
  set: "set",
  print: "print",
} as const;

function createDeclare(item: ButchObj): JSX.Element {
  if (item === undefined) return React.createElement(DeclarationBlock);
  return React.createElement(DeclarationBlock, item);
}

function createWhile(item: ButchObj): JSX.Element {
  if (item === undefined) return React.createElement(WhileLoopBlock);
  return React.createElement(WhileLoopBlock, item);
}

function createFor(item: ButchObj): JSX.Element {
  if (item === undefined) return React.createElement(ForLoopBlock);
  return React.createElement(ForLoopBlock, item);
}

function createFunction(item: ButchObj) {
  if (item === undefined) return React.createElement(FunctionBlock);
  return React.createElement(FunctionBlock, item);
}

const ProgramBlocks: { [key: string]: React.FC<any> } = {
  declare: DeclarationBlock,
  function: FunctionBlock,
  // invoker:,
  // deref:,
  // type:,
  // name:,
  // nameSeq:,
  // content:,
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
};

export default function createProgramBlock(item: ButchObj): JSX.Element {
  if (item.content === undefined) return React.createElement(FunctionBlock); // Plug
  const type: string = item.get("type");
  let createdItem: JSX.Element;

  React.createElement(ProgramBlocks[type]);
  switch (type) {
    case "declare":
      createdItem = createDeclare(item);
      break;
    case "while":
      createdItem = createWhile(item);
      break;
    case "function":
      createdItem = createFunction(item);
      break;
    default:
      DRErrors.incorrectType(type);
  }
  // Plug
  return createdItem;
}
