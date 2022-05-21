import React, { useCallback, useContext } from "react"
import { TouchableNativeFeedback, View, Text } from "react-native"
import { ButchObj } from "../../Butch/ButchObj"
import ToolBar from "../SimpleToolbar"
import { Navigator } from "../StackNav"
import { disposableCallback } from "../../Utilities/tools"
import { BlocksList } from "../BlocksList"
import { butchGlobContext } from "../../Contexts/AppContexts"
// import { makeStyles, useTheme } from "@rneui/themed"
import { CompilationError } from "../../Butch/errors"

import { makeStyles } from "react-native-elements"
import confStyles from "../../Config/styles"

/**
 * TODO: that function must assemble array of index-pathes to blocks, which need rebuilding
 */
declare function assembleChanges(obj: ButchObj): number[][];

const WorkSpaceScreen: React.FC<{
  navigator: Navigator,
  target: ButchObj
}> = ({ navigator, target }) => {
  const butchGlobals = useContext(butchGlobContext)

  const onLaunch = useCallback(() => {
    if (butchGlobals.builder === null || butchGlobals.programObj === null) return;
    
    try {
      if (butchGlobals.program.executable === null || butchGlobals.program.isChanged) {
        butchGlobals.program.executable = butchGlobals.builder?.build(butchGlobals.programObj)
      } 
    } catch (e) {
      if (e instanceof CompilationError) {
        butchGlobals.builder.pushBuffer(e.name + "\n" + e.message);
        butchGlobals.builder.flushBuffer();
      }
    } 
    
    butchGlobals.program.isChanged = false;
    
    navigator.goTo(
      "console", 
      { doClearing: disposableCallback(() => true) }, 
      () => {
        if (butchGlobals.program.executable) {
            butchGlobals.program.executable.execute();
        }
      })
  }, [butchGlobals, navigator]) 

  const styles = makeStyles(confStyles)()

  return <View>
    <ToolBar>
      <TouchableNativeFeedback onPress={() => navigator.goTo("globals")}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>Globals</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => onLaunch()}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>Launch</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback onPress={() => navigator.goTo("console")}>
        <View style={styles.buttonView}>
          <Text style={styles.buttonText}>Console</Text>
        </View>
      </TouchableNativeFeedback>
    </ToolBar> 
    { target && <BlocksList objToRender={target}/> }
  </View>
}

export default WorkSpaceScreen