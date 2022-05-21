import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@rneui/themed";
import { Children, IStyle } from "../types/Types";

import Colors from "../config/colors";

interface BlockProps {
  children: Children;
  style?: IStyle;
}

const defaultStyles = makeStyles(theme => ({
  containerStyles: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: Colors.purpleMedium,
    minHeight: 40,
    marginTop: 20,
  },
}));

export function Block({ children, style }: BlockProps) {
  const { theme } = useTheme();
  const defaultStyle = defaultStyles(theme);

  return <View style={[style, defaultStyle.containerStyles]}>{children}</View>;
}

Block.propTypes = {
  children: PropTypes.any,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
