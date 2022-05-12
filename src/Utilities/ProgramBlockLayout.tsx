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

function createDeclare(type: string, content: CButchObj[]) {
  // const declarationBlock = React.createElement(DeclarationComponent, {
  //   expression: content[0].get("expression") ? content[0].get("value"),
  // });
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
