// import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

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
