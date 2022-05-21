import React from "react";
import { Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import { DataPicker } from "./DataPicker";
import Draggable from "./Draggable";
import DRErrors from "../Errors";

interface BlockProps {
  item: ButchObj;
}

export default function IfBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  // console.log(item.content);

  const getIfExpression: ((index: number) => string) = (index: number) => {
    if (index == 0 && item.content !== undefined) return item.content[index].get("value");

    if (index != 0 && item.content !== undefined) return item.content[index].content?.get("value");
  };

  return (
    <Draggable item={item}>
      <DataPicker item={item} style={styles.container}>
        <Block style={{ margin: 0, color: "white" }}>
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
  container: { marginBottom: 10 },
  blockText: {
    fontSize: 14,
    color: "#F4EEFF",
  },

  inputText: {
    fontSize: 14,
    marginLeft: 8,
    backgroundColor: "#F4EEFF",
    color: "#424874",
  },
}));
