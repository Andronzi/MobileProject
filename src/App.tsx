import React, { useContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import rnfs from "react-native-fs";

import ConsoleScreen from "./Components/Screens/Console";
import WorkSpaceScreen from "./Components/Screens/Workspace";
import GlobalsScreen from "./Components/Screens/Globals";
import { createNavContainer } from "./Components/StackNav";

import { butchGlobContext } from "./Contexts/AppContexts";

import { ButchBuilder } from "./Butch/Butch";
import { ButchObj } from "./Butch/ButchObj";

type AppData = { builder: ButchBuilder } | undefined;

function initButchGlobals(): Promise<{
  builder: ButchBuilder;
  programObj: ButchObj;
}> {
  return Promise.all([
    ButchBuilder.initDefaultBuilder(),
    rnfs.readFileAssets("bch/functionCheck.json"),
  ]).then(([builder, namedProg]) => {
    const encoded = builder.encodeNamedProgram(namedProg);
    const programObj = new ButchObj(JSON.parse(encoded), builder.getCodes(), builder.getRCodes());

    return { builder, programObj };
  });
}

const Nav = createNavContainer();

export const App: React.FC = () => {
  const butchGlogals = useContext(butchGlobContext);
  const [appData, setAppData] = useState<AppData>();

  const { theme } = useTheme();
  const styles = useStyles(theme);

  if (!appData) {
    initButchGlobals()
      .then(_butchGlobals => {
        setAppData(prev => {
          butchGlogals.builder = _butchGlobals.builder;
          butchGlogals.programObj = _butchGlobals.programObj;
          return { ...prev, builder: _butchGlobals.builder };
        });
      })
      .catch(e => console.log(e));

    return (
      <View style={styles.loadScreen}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  } else
    return (
      <View style={{ zIndex: 0 }}>
        <Nav.Stack>
          <Nav.Screen
            name={"console"}
            component={ConsoleScreen}
            transProps={{ builder: appData.builder }}
          />
          <Nav.Screen name={"default"} component={WorkSpaceScreen} transProps />
          <Nav.Screen name="globals" component={GlobalsScreen} />
        </Nav.Stack>
      </View>
    );
};

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
