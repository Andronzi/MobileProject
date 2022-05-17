import React, { useContext } from "react";

import { ButchObj } from "../Butch/ButchObj";
import useStateCallback from "src/Hooks/useStateCallback";
import useComponentData from "src/Hooks/useComponentData";
import { View } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import Droppable from "./Droppable";
import { useDNDElements } from "./DroppablesData";

interface FunctionalBlockProps {
  item: ButchObj;
}

function FunctionBlock({ item }: FunctionalBlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const context = useDNDElements();
  const [data, onLayout] = useComponentData();
  item.extension.coords = { ...data };

  return (
    // <View onLayout={onLayout}>
    //   {/* <Title></Title> */}
    //   <FlatList
    //     style={styles.container}
    //     data={item.content}
    //     renderItem={item => createProgramBlock(item.item)}
    //   />
    // </View>
    <View onLayout={onLayout}>
      <Droppable content={item.content} />
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: {},
}));
