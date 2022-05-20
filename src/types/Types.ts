// import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import Program, { ButchBuilder } from "src/Butch/Butch";
import { ButchObj } from "src/Butch/ButchObj";

// type StyleType =
//   | StyleProp<ViewStyle>
//   | StyleProp<TextStyle>
//   | StyleProp<ImageStyle>
//   | undefined
//   | Array<Record<string, unknown>>
//   | Record<string, unknown>;
// export default StyleType;

export interface Coordinates {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}

// TODO: test React.Attributes for props
export interface IStyle {
    [key: string]: unknown | undefined;
}
export type Children = React.ReactNode[] | undefined;

export type ButchCodes = { __hash: string; [key: string]: string };

export type ButchGlobals = {
    builder: ButchBuilder | null,
    programObj: ButchObj | null,
    program: { executable: Program | null, isChanged: boolean }
}

const blockNamesArr = ["function", "declare", 
    "while", "for", "if", "print", "expression", "break", "return"] as const;

export type BlocksNames = typeof blockNamesArr[number];
