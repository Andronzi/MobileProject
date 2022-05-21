import React from "react";
import { Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import { DataPicker } from "./DataPicker";
import Draggable from "./Draggable";
import DRErrors from "../Errors";

import Colors from "../config/colors"

interface BlockProps {
  item: ButchObj;
}

export default function IfBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  // console.log(item.content);

  const getIfExpression: (index: number) => string = (index: number) => {
    if (index == 0 && item.content !== undefined) return item.content[index].get("value");

    if (index != 0 && item.content !== undefined) return item.content[index].content?.get("value");
  };

  return (
    <Draggable item={item}>
      <DataPicker item={item}>
        <Block style={{ padding: 10 }}>
          <Text style={styles.blockText}>{item.type}</Text>
          <TextInput style={styles.blockText} value={getIfExpression(0)} />
          <TextInput style={styles.blockText} value={getIfExpression(1)} />
          {item.content && item.content[2] && (
            <TextInput style={styles.blockText} value={getIfExpression(2)} />
          )}
        </Block>
        <Droppable content={item.content?.splice(3, item.content.length)} />
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