import React, { useContext } from "react";
import { TouchableNativeFeedback, View, Text } from "react-native";
import { ButchObj } from "../../Butch/ButchObj";
import ToolBar from "../SimpleToolbar";
import { Navigator } from "../StackNav";
import { disposableCallback } from "../../Utilities/tools";
import { BlocksList } from "../BlocksList";
import { butchGlobContext } from "../../Contexts/AppContexts";
import { makeStyles, useTheme } from "@rneui/themed";

/**
 * TODO: that function must assemble array of index-pathes to blocks, which need rebuilding
 */
declare function assembleChanges(obj: ButchObj): number[][];

const WorkSpaceScreen: React.FC<{
  navigator: Navigator;
  target: ButchObj;
}> = ({ navigator, target }) => {
  const butchGlobals = useContext(butchGlobContext);

  const onLaunch = () => {
    if (butchGlobals.builder === null || butchGlobals.programObj === null) return;

    if (butchGlobals.program.executable === null || butchGlobals.program.isChanged) {
      butchGlobals.program.executable = butchGlobals.builder?.build(butchGlobals.programObj);
    }
    // else if (butchGlobals.program.isChanged) {
    //   butchGlobals.builder?.rebuild(
    //     butchGlobals.program.executable,
    //     butchGlobals.programObj,
    //     assembleChanges(butchGlobals.programObj));
    // }

    butchGlobals.program.isChanged = false;

    navigator.goTo("console", { doClearing: disposableCallback(() => true) }, () => {
      if (butchGlobals.program.executable) butchGlobals.program.executable.execute();
    });
  };

  const { theme } = useTheme(),
    styles = useStyles(theme);

  return (
    <View>
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

        {/* <Button title="Globals" onPress={() => { navigator.goTo("globals") }} />
      <Button title="Launch" onPress={() => onLaunch()} />
      <Button title="Console" onPress={() => { navigator.goTo("console") }} /> */}
      </ToolBar>

      <Text>{JSON.stringify(target?.data)}</Text>
      {target !== undefined ? <BlocksList objToRender={target} /> : undefined}
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  buttonView: {
    padding: 10,
    height: "100%",
    justifyContent: "center",
    flex: 1,
  },
  buttonText: {
    alignSelf: "center",
    fontSize: 18,
    color: "white",
  },
}));

export default WorkSpaceScreen;
