import React, { useCallback, useContext, useState } from "react"
import { makeStyles, useTheme } from "@rneui/themed"
import { View, Text, FlatList, TouchableNativeFeedback, Modal, LayoutRectangle } from "react-native"
import { butchGlobContext } from "../../Contexts/AppContexts"
import ToolBar, { LeftArrow } from "../SimpleToolbar"
import { Navigator } from "../StackNav"
import AddButton from "../AddButton"
import SelectBlock from "../BlockSelector"

import { ButchObj } from "src/Butch/ButchObj"

function createCard(obj: ButchObj, styles: {
  default: object,
  [key: string]: object
}): JSX.Element {
  switch (obj.type) {
    case "function": 
      return <View style={[styles.default, styles.function]}>
        <Text style={styles.nameText}>
          { obj.get("name") }
        </Text>
        <Text style={styles.typeText}>
          { "// function" }
        </Text>
      </View>

    case "declare": 
      return <View style={[styles.default, styles.declare]}>
        <Text style={styles.nameText}>
          { obj.get("name") + " = " + (
            obj.content ? obj.content[0].get("value") : undefined) }
        </Text>
        <Text style={styles.typeText}>
          { "// global variable" }
        </Text>
      </View>
  
    default:
      return <View style={styles.default}>
        <Text>{"Invalid type " + type}</Text>
      </View>;
  }
}

const GlobalsScreen: React.FC<{ 
  navigator: Navigator 
}> = ({ navigator }) => {
  const programObj = useContext(butchGlobContext).programObj;
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [selectorVisible, setSelectorVisible] = useState(false);

  // const creteNewFunction = useCallback(() => {
    
  // }, [programObj]);

  const { theme } = useTheme(), styles = useStyles(theme);

  return <View 
    onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout) }
    style={styles.screen}
  >
    <ToolBar>
      <LeftArrow onPress={() => navigator.goBack()}/>
    </ToolBar>

    <Modal 
      animationType = "fade"
      transparent={true}
      visible={selectorVisible}
      presentationStyle="overFullScreen"
      onRequestClose={() => setSelectorVisible(false)}
    >
      <SelectBlock 
        onClose={() => setSelectorVisible(false)} 
        choices={[
          ["function", ()=>{}],
          ["variable", ()=>{}],
        ]}
      />
    </Modal>

    <AddButton onPress={() => setSelectorVisible(true)} parentLatout={layout}/>
    
    <FlatList data={programObj?.content} renderItem={({ item }) => 
      <View style={styles.margins}>
        <TouchableNativeFeedback onPress={() => { 
          setTimeout(() => navigator.goBack({ target: item })); 
        }}>
          { createCard(item, styles) }
        </TouchableNativeFeedback> 
      </View>
    }/>
  </View>
}

const useStyles = makeStyles(theme => ({
  screen: {
    height: "100%", 
    backgroundColor: "white" 
  },
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
    fontSize: 24,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  typeText: {
    minWidth: 75,
    flexShrink: 10,
    fontSize: 20,
    fontStyle: "italic",
    color: theme.colors.grey0,
    opacity: 0.75,
    alignSelf: "center"
  },
  nameText: {
    flexShrink: 1,
    fontSize: 24,
    color: theme.colors.black,
    marginRight: 20
  },
  margins: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  }
}))

export default GlobalsScreen;