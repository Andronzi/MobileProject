import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

import { makeStyles, useTheme } from "@rneui/themed";
import { Children, IStyle } from "../Types/Types"

interface BlockProps {
  children: Children;
  style?: IStyle;
}

const defaultStyles = makeStyles((theme) => ({
  containerStyles: {
    flexDirection: "row",
    borderRadius: 5,
    background: theme.colors?.black
  }
}));

const { theme } = useTheme();
const defaultStyle = defaultStyles(theme);

export function Block({ children, style }: BlockProps) {
  return (
    <View style={[defaultStyle, style]}>
      {children}
    </View>
  )
}

Block.propTypes = {
  children: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
}