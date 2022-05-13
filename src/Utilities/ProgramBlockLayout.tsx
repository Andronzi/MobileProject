import React from "react";

import {
  ConditionalComponent,
  ForLoopComponent,
  FunctionComponent,
  DeclarationComponent,
  WhileLoopComponent,
} from "../Modules/ProgramBlocks";
import { CButchObj } from "src/Butch/ButchObj";
import DRErrors from "src/Errors";
import { DeclarationBlock } from "src/types/Types";


const stringFields = ["type", "name", "value"] as const;
type StringField = (typeof stringFields)[number];

const stringArrayFields = ["nameSeq"] as const;
type StringArrayField = (typeof stringArrayFields)[number];

const recursiveFields = ["content"];
type RecursiveField = (typeof recursiveFields)[number];

function isStringField(value: any): value is StringField {
    return stringFields.includes(value);
}

function isStringArrayField(value: any): value is StringArrayField {
    return stringArrayFields.includes(value);
}

function isRecursiveField(value: any): value is RecursiveField {
    return recursiveFields.includes(value);
}

function createDeclare(content: CButchObj[]) {
  
  
  const d = "name";
  const props: DeclarationBlock = {
    name: isStringField(s) ? content[0].get(s) : "",
    expression:  
  }

  const declarationBlock = React.createElement(DeclarationComponent, {});
}

export default function createProgramBlock(item: CButchObj): JSX.Element {
  if (item.cContent === undefined) return React.createElement(FunctionComponent); // Plug
  const itemPayload = item.get("type");
  const type: string = typeof itemPayload === "string" ? itemPayload : DRErrors.incorrectType();

  for (let i = 0; i < item.cContent.length; i++) {}

  switch (type) {
    case "declare":
      break;
  }
  // Plug
  return React.createElement(FunctionComponent);
}
