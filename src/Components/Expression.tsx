import React from "react";
import { Text } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import Draggable from "./Draggable";
import { DataPicker } from "./DataPicker";
interface BlockProps {
  item: ButchObj;
}

export default function ExpressionBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  // console.log(item.content);

  return (
    <Draggable item={item}>
      <DataPicker item={item}>
        <Block style={{ padding: 10 }}>
          <Text style={styles.blockText}>{item.type}</Text>
          <Text style={styles.inputText}>{item.get("value")}</Text>
        </Block>
        <Droppable content={item.content} />
      </DataPicker>
    </Draggable>
  );
}

const useStyles = makeStyles(theme => ({
  blockText: {
    fontSize: 18,
    color: Colors.purpleLight,
  },

  inputText: {
    margin: 10,
    fontSize: 18,
    backgroundColor: Colors.purpleLight,
    color: Colors.purpleDark,
    borderRadius: 10,
    padding: 10
  },
}));