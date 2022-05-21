import React, { useCallback, useContext, useState } from "react"
import { 
  View, 
  Text, 
  FlatList, 
  TouchableNativeFeedback, 
  Modal, 
  LayoutRectangle, 
  Button, 
  TouchableOpacity, 
  TextInput
} from "react-native"
import { Icon, makeStyles, useTheme } from "@rneui/themed"
import rnfs from "react-native-fs"
import { butchGlobContext } from "../../Contexts/AppContexts"
import ToolBar, { LeftArrow } from "../SimpleToolbar"
import { Navigator } from "../StackNav"
import AddButton from "../BlockUI/AddButton"
import SelectBlock from "../BlockUI/BlockSelector"
import OptionalMenu from "../OptionsMenu"

import { ButchObj } from "src/Butch/ButchObj"
import confStyles from "../../Config/styles"
import ErrorWin from "../Error"

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
  const glogContext = useContext(butchGlobContext);
  const { programObj, program } = glogContext;
  const [layout, setLayout] = useState<LayoutRectangle>();
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false)

  const [selected, setSelected] = useState<string>();
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [, _setProgramName] = useState(program.name);
  const setProgramName = useCallback((name: string) => {
    _setProgramName(name);
    program.name = name;
  }, [program])
  const [opMenuData, setOpMenuData] = useState<{
    visible: boolean,
    pos: { top: number, left: number },
    targetIndex: number,
    timeout?: NodeJS.Timeout
  }>({
    visible: false,
    pos: { top: 0, left: 0 },
    targetIndex: -1
  })

  const appendContent = useCallback(
    (obj: ButchObj | null) => {
      if (programObj && programObj.content && obj)
        programObj.content =  [...programObj.content, obj];
    }, [programObj]
  );

  const onSave = useCallback(() => {
    rnfs.writeFile(`${rnfs.DocumentDirectoryPath}/${program.name}.bch`, 
      JSON.stringify(programObj?.data));
  }, [programObj, program]);

  const onLoad = useCallback(() => {
    rnfs.readFile(`${rnfs.DocumentDirectoryPath}/${program.name}.bch`)
      .then(data => {
        glogContext.programObj = programObj?.wrap(JSON.parse(data)) || null;
        console.log(glogContext.programObj);
      }).catch(e => {
        console.log(e);
        setErrorVisible(true);
      })
  }, [programObj, program]);

  const reset = useCallback(() => {
    setSelectorVisible(false);
    setSelected(undefined);
    setName("");
    setValue("");
  }, [setSelectorVisible, setSelected, setName, setValue])

  const { theme } = useTheme(), styles = useStyles(theme);
  const btnStyles = makeStyles(confStyles)();

  return <View 
    onLayout={({ nativeEvent }) => setLayout(nativeEvent.layout) }
    style={styles.screen}
  >
    <ToolBar>
      <LeftArrow onPress={() => navigator.goBack()}/>
        <TouchableNativeFeedback onPress={onLoad}>
          <View style={btnStyles.buttonView}>
            <Text style={btnStyles.buttonText}>Load</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableNativeFeedback onPress={onSave}>
          <View style={btnStyles.buttonView}>
            <Text style={btnStyles.buttonText}>Save</Text>
          </View>
        </TouchableNativeFeedback>
    </ToolBar>

    <View style={styles.programName}>
      <View style={{ justifyContent: "center", marginRight: 3 }}>
        <Text style={styles.progNameText}>ProgName :</Text>
      </View>
      <TextInput 
        style={[styles.textInput, { flex: 1, paddingBottom: 0}]}
        value={program.name} 
        onChange={({ nativeEvent }) => {
          setProgramName(nativeEvent.text);
      }}/>
    </View>

    <ErrorWin 
      message="Invalid programm name to load"
      visible={errorVisible} 
      onClose={() => setErrorVisible(false)}
    />

    <Modal 
      animationType = "fade"
      transparent={true}
      visible={selectorVisible}
      presentationStyle="overFullScreen"
      onRequestClose={() => setSelectorVisible(false)}
    >
      <SelectBlock 
        onClose={() => reset()} 
        choices={[
          ["function", () => setSelected("function")],
          ["variable", () => setSelected("variable")],
        ]}
      >
        <View style={[{ display: selected ? "flex" : "none" }]}>
          <View>
            <Text style={styles.typeText}>Name</Text>
            <TextInput 
              defaultValue="name" 
              style={styles.textInput}
              onChange={({ nativeEvent }) => setName(nativeEvent.text)} 
              value={name} 
            />
          </View>
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
            <View style={{ flex: 1}}>
              <Button title="Add" onPress={() => {
                appendContent(programObj && (
                  selected === "function" ? programObj.createFunction()
                    : programObj.createDeclare()));
                reset();
              }}/>
            </View>
          </View>
        </View>
      </SelectBlock>
    </Modal>

    <AddButton onPress={() => setSelectorVisible(true)} parentLatout={layout}/>
    <OptionalMenu pos={opMenuData.pos} visible={opMenuData.visible}>
      <TouchableOpacity activeOpacity={0.5} onPress={() => {
        if (programObj)
          programObj.content = programObj?.content?.filter(
            (_, i) => i !== opMenuData.targetIndex);
            
        setOpMenuData(prev => ({...prev, visible: false, targetIndex: -1}))
      }}>
        <Icon 
          name="trash"
          type="entypo"
          size={40}
        />
      </TouchableOpacity>
    </OptionalMenu>

    <FlatList data={programObj?.content} renderItem={({ item, index }) => 
      <View style={styles.margins} >
        <TouchableNativeFeedback 
          onPress={() => {
            setTimeout(() => navigator.goBack({ target: item })); 
          }}
          onLongPress={({ nativeEvent }) => {
            clearTimeout(opMenuData.timeout);
            setOpMenuData({
              visible: true,
              pos: { top: nativeEvent.pageY, left: nativeEvent.pageX },
              targetIndex: index,
              timeout: setTimeout(
                () => setOpMenuData(prev => ({...prev, visible: false})), 
                2000)
            });
          }}
        >
          { createCard(item, styles) }
        </TouchableNativeFeedback> 
      </View>
    }/>
    
  </View>
}

const useStyles = makeStyles(theme => ({
  progNameText:{
    fontWeight:"bold", 
    color: "black"
  },
  programName: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: theme.colors.primary
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