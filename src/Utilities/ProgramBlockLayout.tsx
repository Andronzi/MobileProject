import React from "react";

import {
  ConditionalBlock,
  ForLoopBlock,
  FunctionBlock,
  DeclarationBlock,
  WhileLoopBlock,
} from "../Modules/ProgramBlocks";
import { B_ObjPayload, CButchObj, B_Obj } from "src/Butch/ButchObj";
import DRErrors from "src/Errors";
import { DeclarationBlock } from "src/types/Types";

// const stringFields = ["type", "name", "value"] as const;
// type StringField = (typeof stringFields)[number];

// const stringArrayFields = ["nameSeq"] as const;
// type StringArrayField = (typeof stringArrayFields)[number];

// const recursiveFields = ["content"];
// type RecursiveField = (typeof recursiveFields)[number];

// function isStringField(value: any): value is StringField {
//     return stringFields.includes(value);
// }

// function isStringArrayField(value: any): value is StringArrayField {
//     return stringArrayFields.includes(value);
// }

// function isRecursiveField(value: any): value is RecursiveField {
//     return recursiveFields.includes(value);
// }

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

const someData: B_Obj = {
  s: "string",
  sA: ["string", "array"],
  c: [
    {
      s: "string",
      sA: ["string", "array"],
    },
  ],
};

console.log(someData);

const PossiblyItemFields = {
  type: "type",
  name: "name",
  nameSeq: "nameSeq",
  content: "content",
};
interface ParsedB_Obj {
  type: string;
  name?: string;
  nameSeq?: string;
  content?: ParsedB_Obj[];
}

// TODO: переписать декларацию функции, чтобы та принимала на вход CButchObj. Тогда парсинг будет происходить внутри компоненты
function parseByKey(item: CButchObj): ParsedB_Obj {
  const result: ParsedB_Obj = { type: "" };

  for (const key of Object.keys(item)) {
    if (PossiblyItemFields[key] !== undefined) {
      result[key] = item.get(key);
    }
  }
}

function createDeclare(item: CButchObj): JSX.Element {
  if (item === undefined) return React.createElement(DeclarationBlock);

  return React.createElement(DeclarationBlock, item);
}

function createWhile(item: CButchObj): JSX.Element {
  if (item === undefined) return React.createElement(WhileLoopBlock);

  return React.createElement(WhileLoopBlock, item);
}

function createFor(item: CButchObj): JSX.Element {
  if (item === undefined) return React.createElement(ForLoopBlock);

  return React.createElement(ForLoopBlock, item);
}

function createFunction(item: CButchObj) {
  if (item === undefined) return React.createElement(FunctionBlock);

  return React.createElement(FunctionBlock, item);
}

export default function createProgramBlock(item: CButchObj): JSX.Element {
  if (item.cContent === undefined) return React.createElement(FunctionBlock); // Plug
  const itemPayload = item.get("type");
  const type: string =
    typeof itemPayload === "string" ? itemPayload : DRErrors.incorrectType(itemPayload);
  let createdItem: JSX.Element;

  switch (type) {
    case "declare":
      createdItem = createDeclare(item);
      break;
    case "while":
      createdItem = createWhile();
      break;
    case "function":
      createdItem = createFunction();
      break;
    default:
      DRErrors.incorrectType(type);
  }
  // Plug
  return createdItem;
}
