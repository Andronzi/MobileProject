import { FunctionBlock, LoopBlock, DeclarationBlock, ConditionalOperator } from "./../types/Types";

export declare function FunctionComponent({ name, args }: FunctionBlock): JSX.Element;

export declare function WhileLoopComponent({ expression }: LoopBlock): JSX.Element;

export declare function ForLoopComponent({ expression }: LoopBlock): JSX.Element;

export declare function DeclarationComponent({ name, expression }: DeclarationBlock): JSX.Element;

export declare function ConditionalComponent({
    type,
    expression,
}: ConditionalOperator): JSX.Element;
