import React, { useCallback, useContext, useState } from "react"
import { 
  View, 
  Text, 
  FlatList, 
  TouchableNativeFeedback, 
  Modal, 
  LayoutRectangle, 
  Button 
} from "react-native"
import { makeStyles, useTheme } from "@rneui/themed"
import { butchGlobContext } from "../../Contexts/AppContexts"
import ToolBar, { LeftArrow } from "../SimpleToolbar"
import { Navigator } from "../StackNav"
import AddButton from "../BlockUI/AddButton"
import SelectBlock from "../BlockUI/BlockSelector"

import { ButchObj } from "src/Butch/ButchObj"
import { TextInput } from "react-native-gesture-handler"

function createCard(obj: ButchObj, styles: {
  default: object,
  [key: string]: object
}): JSX.Element {
  switch (obj.type) {
    case "function": 
      return <View style={[styles.default, styles.function]}>
        <Text style={styles.nameText}>
          { obj.get("name") || "{noname}" }
        </Text>
        <Text style={styles.typeText}>
          { "// function" }
        </Text>
      </View>

    case "declare": 
      return <View style={[styles.default, styles.declare]}>
        <Text style={styles.nameText}>
          { obj.get("name") || "{noname}" + " = " + (
            obj.content ? obj.content[0].get("value") || "{none}" : undefined) }
        </Text>
        <Text style={styles.typeText}>
          { "// global variable" }
        </Text>
      </View>
  
    default:
      return <View style={styles.default}>
        <Text>{"Invalid type " + obj.type}</Text>
      </View>;
  }
}

const GlobalsScreen: React.FC<{ 
  navigator: Navigator 
}> = ({ navigator }) => {
  const programObj = useContext(butchGlobContext).programObj;
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [selectorVisible, setSelectorVisible] = useState(false);

  const [selected, setSelected] = useState<string>();
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const appendContent = useCallback(
    (obj: ButchObj | null) => {
      if (programObj && programObj.content && obj)
        programObj.content =  [...programObj.content, obj];
    }, [programObj]
  );

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
          ["function", () => {
            setSelected("function"); //setSelectorVisible(false)
          }],
          ["variable", () => {
            setSelected("variable"); //setSelectorVisible(false)
          }],
        ]}
      >
        <View style={[styles.addBlockCard, { display: selected ? "flex" : "none" }]}>
          <Text style={styles.typeText}>Name</Text>
          <TextInput 
            defaultValue="name" 
            style={styles.textInput}
            onChange={({ nativeEvent }) => setName(nativeEvent.text)} 
            value={name} 
          />
          { selected === "variable" ? (
            <View>
              <Text style={styles.typeText}>Value</Text>
              <TextInput 
                defaultValue="value" 
                style={styles.textInput}
                onChange={({ nativeEvent }) => setValue(nativeEvent.text)} 
                value={value} 
              /> 
            </View>
          ) : undefined }
          <View style={{ flexDirection: "row", justifyContent: "space-around"}}>
            <View style={[styles.margins, { flex: 1}]}>
              <Button title="Add" onPress={() => {
                appendContent(programObj && (
                  selected === "function" ? programObj.createFunction()
                    : programObj.createDeclare()));
                setSelected(undefined);
              }}/>
            </View>
            {/* <View style={[styles.margins, { flex: 1}]}>
                <Button title="close" onPress={() => setSelected(undefined)}/>
            </View> */}
          </View>
        </View>
      </SelectBlock>
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
  addBlockCard: {
  },
  textInput: {
    borderBottomColor: theme.colors.grey0,
    borderBottomWidth: 1,
    marginBottom: 10
  },
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