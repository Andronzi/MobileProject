import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "../hooks/useComponentData";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { useDNDElements } from "./DroppablesData";
import { Block } from "../Components/Block";

import Colors from "../config/colors";

interface BlockProps {
  item: ButchObj;
}

export default function ConditionalBlock({ item }: BlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const context = useDNDElements();

  const selfRef = useRef<View>(null);
  useEffect(() => {
    selfRef?.current?.measure((fx, fy, width, height, px, py) => {
      item.extension.coords = { px, py };
      item.extension.size = { width, height };
    });
  });

  // console.log(item.content);

  return (
    <View ref={selfRef}>
      <Block style={{ padding: 10 }}>
        <Text style={styles.blockText}>{item.type}</Text>
        <TextInput style={styles.inputText} placeholder="expression" value={item.get("value")} />
      </Block>
      <Droppable content={item.content} />
    </View>
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