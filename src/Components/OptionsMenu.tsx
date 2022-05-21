import React from "react"
import { View } from "react-native"
import { makeStyles, useTheme } from "@rneui/themed"
import useComponentData from "../hooks/useComponentData"

export type showCallback = (where: { top: number, left: number }) => void

const OptionalMenu: React.FC<{ 
  pos: { top: number, left: number },
  visible: boolean, 
  children?: React.ReactNode,
}> = ({ 
  pos,
  visible,
  children
}) => {
  const [data, onLayout] = useComponentData(undefined);

  const { theme } = useTheme(), styles = useStyles(theme);

  return <View 
    onLayout={onLayout}
    style={[styles.window, 
      { 
        top: pos.top - (data?.height ?? 0),
        left: pos.left - (data?.width ?? 0) / 2
      },
      { display : visible ? "flex" : "none" }]}>
    { children }
  </View>
}

const useStyles = makeStyles(theme => ({
  window: {
    zIndex: 300,
    position: "absolute",
    backgroundColor: theme.colors.secondary,
    elevation: 10,
    shadowColor: theme.colors.black,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.greyOutline
  }
}))

export default OptionalMenu;