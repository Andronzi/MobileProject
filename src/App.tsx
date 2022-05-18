import React, { useContext, useState } from "react";
import { ActivityIndicator, View, Text, Button } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed"

import { BlocksList } from './Components/BlocksList';
import ConsoleScreen from "./Components/ConsoleScreen";
import { createNavContainer } from "./Components/StackNav";
import ToolBar, { LeftArrow } from "./Components/SimpleToolbar";

import { butchGlobContext } from "./Contexts/AppContexts";

import { testBchFile, manualTest } from "./Butch/main"
import { ButchBuilder } from "./Butch/Butch";
import { disposableCallback } from "./Utilities/tools"
import ButchObjBase from "./Butch/ButchObj";

type AppData = { builder: ButchBuilder } | undefined;

function initButchGlobals(): Promise<{
  builder: ButchBuilder,
  programObj: ButchObjBase
}> {
  return ButchBuilder.initDefaultBuilder().then(builder => ({
    builder,
    programObj: ButchObjBase.createEmptyProgram(builder.getCodes())
  }))
}



const Nav = createNavContainer();

export const App: React.FC = () => {
  const butchGlogals = useContext(butchGlobContext);
  const [appData, setAppData] = useState<AppData>();

  const { theme } = useTheme();
  const styles = useStyles(theme);
  
  if (!appData) {
    initButchGlobals().then(_butchGlobals => {
      setAppData(prev => {
        butchGlogals.builder = _butchGlobals.builder;
        butchGlogals.programObj = _butchGlobals.programObj;
        return { ...prev, builder: _butchGlobals.builder };
      });
    }) 

    return <View style={styles.loadScreen}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>   
  } 
  else return (
    <View style={{ zIndex: 0 }}>
      <Nav.Stack>
        <Nav.Screen name={"console"} 
          component={ConsoleScreen} 
          transProps={{ builder: appData.builder }} 
        />
        <Nav.Screen name={"default"} component={ 
          ({ navigator }) => (
            <View>
              <ToolBar>
                <Button title="Globals" onPress={() => { navigator.goTo("globals") }} />
                <Button title="Launch" onPress={() => { 
                  testBchFile(appData.builder); 
                  // manualTest();
                  navigator.goTo("console", { doClearing: disposableCallback(() => true)})
                }} />
                <Button title="Console" onPress={() => { navigator.goTo("console") }} />
              </ToolBar>
              <BlocksList />
            </View>
          )
        } />
        <Nav.Screen name="globals" component={ ({ navigator }) => <>
            <ToolBar>
              <LeftArrow onPress={() => navigator.goBack()}/>
            </ToolBar>
            <View><Text>Place here list of functions and global variables</Text></View>
          </>
        } />
      </Nav.Stack>
    </View>
  )
}

const useStyles = makeStyles(theme => ({
  loadScreen: {
    backgroundColor: theme.colors?.background,
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%",
  },
}));

export default App;
