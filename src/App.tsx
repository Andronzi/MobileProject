import React, { useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import { useTheme, makeStyles, Button } from "@rneui/themed"

import { BlocksList } from './Components/BlocksList';
import ConsoleScreen from "./Components/ConsoleScreen";
import { createNavContainer } from "./Components/StackNav";

import { testBchFile, manualTest } from "./Butch/main"
import { ButchBuilder } from "./Butch/Butch";
import ToolBar, { LeftArrow } from "./Components/SimpleToolbar";

type AppData = { builder: ButchBuilder; new?: string };

function initApp(): Promise<AppData> {
  let appData: AppData;
  const tasks = [
    ButchBuilder.initDefaultBuilder().then(builder => {
      appData = { ...appData, builder };
    }),
  ];

  return Promise.all(tasks).then(() => appData);
}

const Nav = createNavContainer();

export const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData | undefined>();

  const { theme } = useTheme();
  const styles = useStyles(theme);

  if (!appData) {
    initApp().then(data => {
      setAppData(data);
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
                  navigator.goTo("console", { reset: true });
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
