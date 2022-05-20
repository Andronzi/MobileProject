import React from "react";
import { View, Text } from "react-native";
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
    borderRadius: 5,
    background: "#A6B1E1",
  },
}));

export function Block({ children, style }: BlockProps) {
  const { theme } = useTheme();
  const defaultStyle = defaultStyles(theme);

  return (
    <View style={[defaultStyle, style]}>
      <>
        {React.Children.map(children, child => {
          return { child };
        })}
      </>
    </View>
  );
}

Block.propTypes = {
  children: PropTypes.array,
  style: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};
