import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import Draggable from "./Draggable";
import { DataPicker } from "./DataPicker";

import Colors from "../config/colors"

interface BlockProps {
  item: ButchObj;
}

export default function DeclarationBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  const selfRef = useRef<View>(null);
  useEffect(() => {
    selfRef?.current?.measure((fx, fy, width, height, px, py) => {
      item.extension.coords = { px, py };
      item.extension.size = { width, height };
    });
  });

  // console.log(item.content);

  return (
    <Draggable item={item}>
      <DataPicker item={item}>
        <Block style={{ padding: 10 }}>
          <Text style={styles.blockText}>{item.type}</Text>
          <TextInput style={styles.inputText} placeholder="name" value={item.get("name")} />
          <TextInput
            style={styles.inputText}
            placeholder="value"
            value={item.content ? item.content[0].get("value") : ""}
          />
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