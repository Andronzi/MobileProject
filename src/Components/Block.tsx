import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@rneui/themed";
import { Children, IStyle } from "../types/Types";

interface BlockProps {
  children: Children;
  style?: IStyle;
}

const defaultStyles = makeStyles(theme => ({
  containerStyles: {
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#A6B1E1",
  },
}));

export function Block({ children, style }: BlockProps) {
  const { theme } = useTheme();
  const defaultStyle = defaultStyles(theme);

  return <View style={[style, defaultStyle.containerStyles]}>{children}</View>;
}

Block.propTypes = {
  children: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
