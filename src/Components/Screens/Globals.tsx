import { makeStyles, useTheme } from "@rneui/themed"
import React, { useContext } from "react"
import { View, Text, FlatList } from "react-native"
import { TouchableHighlight } from "react-native-gesture-handler"
import { ButchObj } from "src/Butch/ButchObj"
import { butchGlobContext } from "../../Contexts/AppContexts"
import ToolBar, { LeftArrow } from "../SimpleToolbar"
import { Navigator } from "../StackNav"

function createCard(obj: ButchObj, styles: {
  default: object,
  [key: string]: object
}): JSX.Element {
  const type = obj.get("type")
  let content: JSX.Element;
  switch (type) {
    case "function":
      content = <>
        <Text style={styles.nameText}>
          { obj.get("name") }
        </Text>
        <Text style={styles.typeText}>
          { "// function" }
        </Text>
      </>
      break;

    case "declare":
      content = <>
        <Text style={styles.nameText}>
          { obj.get("name") }
        </Text>
        <Text style={styles.typeText}>
          { "// variable" }
        </Text>
      </>
      break;
  
    default:
      content = <Text>{"Invalid type " + type}</Text>
  }

  return <View style={[styles.default, styles[type]]}>
    { content }
  </View>
}

const GlobalsScreen: React.FC<{ 
  navigator: Navigator 
}> = ({ navigator }) => {
  const { theme } = useTheme(), styles = useStyles(theme);
  const programObj = useContext(butchGlobContext).programObj;
createCard(new ButchObj({}, {__hash:"2"}), styles);

  return <View>
    <ToolBar>
      <LeftArrow onPress={() => navigator.goBack()}/>
    </ToolBar>

    <View><Text>Place here list of functions and global variables</Text></View>

    <FlatList data={programObj?.content} renderItem={({ item }) =>
      <TouchableHighlight onPress={() => { navigator.goBack({ target: item }); }}>
        { createCard(item, styles) }
      </TouchableHighlight>
    }/>
  </View>
}

const useStyles = makeStyles(
  theme => ({
    declare: {
      backgroundColor: theme.colors.grey5
    },
    function: {
      backgroundColor: theme.colors.grey4
    },
    default: {
      borderRadius: 5,
      alignContent: "center",
      minHeight: "10%",
      backgroundColor: theme.colors.warning,
      fontSize: 16
    },
    nameText: {
      fontSize: 12,
      fontStyle: "italic",
      color: theme.colors.grey0
    },
    typeText: {
      fontSize: 16,
      color: theme.colors.black
    }
}))

export default GlobalsScreen;