import React from "react"
import { Icon, makeStyles, useTheme } from "@rneui/themed"
import { 
  View, 
  TouchableOpacity, 
  Dimensions, 
  GestureResponderEvent, 
  LayoutRectangle 
} from "react-native"

const AddButton: React.FC<{
  onPress: ((event: GestureResponderEvent) => void) | undefined,
  parentLatout?: LayoutRectangle,
  size?: number,
  posShift?: { right: number, bottom: number }
}> = ({ 
  onPress,
  parentLatout = { x: 0, y: 0, height: 0, width: 0 },
  size = 60,
  posShift = { right: 20, bottom: 20 } 
}) => {
  const { theme } = useTheme(), styles = useStyles(theme);

  const pos = {
    bottom: parentLatout.y + parentLatout.height 
      - Dimensions.get("window").height + posShift.bottom,
    right: parentLatout.x + parentLatout.width 
      - Dimensions.get("window").width + posShift.right,
  }

  return (
    <View style={[styles.addButton, pos]}>
      <TouchableOpacity onPress={onPress}>
        <Icon 
          name="plus"
          type="entypo"
          size={size}
        />
      </TouchableOpacity>
    </View>
  )
}

const useStyles = makeStyles(theme => ({
  addButton: {
    backgroundColor: theme.colors?.secondary, 
    borderRadius: 50,
    position: "absolute", 
    zIndex: 100,

    elevation: 5,
    shadowColor: theme.colors?.black
  }
}));

export default AddButton;