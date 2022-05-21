import React from "react"
import { TouchableOpacity, View, Text, TouchableNativeFeedback } from "react-native"
// import { BlocksNames } from "src/types/Types"
import { makeStyles, useTheme } from "@rneui/themed";
import { FlatList } from "react-native-gesture-handler";

const BlockSelector: React.FC<{
  choices: [string, () => void][],
  onClose: () => void,
  children?: React.ReactNode
  onDefault?: () => void
}> = ({ 
  choices, 
  onClose,
  children,
  onDefault 
}) => {  
  const { theme } = useTheme(), styles = useStyles(theme);

  return <View>
    <View style={styles.fade} />
    <View style={styles.container}>
      <View style={styles.window}>
        <View>
          <FlatList data={choices} renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.selectButton} 
              onPress={() => { item[1](); onDefault && onDefault() }}
            >
              <Text style={styles.selectText}>{ item[0] }</Text>
            </TouchableOpacity> )
          } />
        </View>
        { children }
        <TouchableNativeFeedback onPress={() => onClose()}>
          <View style={styles.closeButton}>
            <Text style={styles.selectText}>Close</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    </View>
  </View>
};

const useStyles = makeStyles(theme => ({
  fade: {
    width: "100%",
    height: "100%",
    opacity: 0.5,
    backgroundColor: theme.colors.black, 
  },
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  window: {
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 100,
    padding: 20,
    backgroundColor: theme.colors.background,

    elevation: 5,
    shadowColor: theme.colors?.black,
  },
  selectButton: {
    backgroundColor: theme.colors.grey4,
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectText: {
    fontSize: 20,
    color: "black",
    alignSelf: "center",
  },
  closeButton: {
    borderRadius: 2,
    marginTop: 10,
    width: "100%",
    padding: 5,
    backgroundColor: theme.colors.warning,
    
    elevation: 5,
    shadowColor: "#ffffff"
  },
  line: {
    marginVertical: 5,
    borderWidth: 1, 
    borderColor: theme.colors.black 
  }
}))

export default BlockSelector