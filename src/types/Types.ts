// import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

import Program, { ButchBuilder } from "src/Butch/Butch";
import ButchObjBase from "src/Butch/ButchObj";

// type StyleType =
//   | StyleProp<ViewStyle>
//   | StyleProp<TextStyle>
//   | StyleProp<ImageStyle>
//   | undefined
//   | Array<Record<string, unknown>>
//   | Record<string, unknown>;
// export default StyleType;

// TODO: test React.Attributes for props
export interface IStyle {
    [key: string]: unknown | undefined;
}
export type Children = React.ReactNode[] | undefined;

export type ButchCodes = { __hash: string, [key: string]: string }

export type ButchGlobals = {
    builder: ButchBuilder | null,
    programObj: ButchObjBase | null,
    executable: Program | null
}
