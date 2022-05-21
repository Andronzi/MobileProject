import React from "react";
import { Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import { DataPicker } from "./DataPicker";

import Colors from "../config/colors";

interface BlockProps {
  item: ButchObj;
}

export default function ConditionalBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <DataPicker item={item}>
      <Block style={{ padding: 10 }}>
        <Text style={styles.blockText}>{item.type}</Text>
        <TextInput style={styles.inputText} placeholder="expression" value={item.get("value")} />
      </Block>
      <Droppable content={item.content} />
    </DataPicker>
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