import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "../hooks/useComponentData";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { useDNDElements } from "./DroppablesData";
import { Block } from "../Components/Block";
import Draggable from "./Draggable";

interface BlockProps {
  item: ButchObj;
}

export default function ExpressionBlock({ item }: BlockProps) {
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
    <Draggable item={item}>
      <View ref={selfRef} style={styles.container}>
        <Block style={{ padding: 10 }}>
          <Text style={styles.blockText}>{item.type}</Text>
          <Text style={styles.inputText}>{item.get("value")}</Text>
        </Block>
        <Droppable content={item.content} />
      </View>
    </Draggable>
  );
}

const useStyles = makeStyles(theme => ({
  container: { marginBottom: 10 },
  blockText: {
    fontSize: 18,
    color: "#F4EEFF",
  },

  inputText: {
    margin: 10,
    fontSize: 18,
    backgroundColor: "#F4EEFF",
    color: "#424874",
    borderRadius: 10,
    padding: 10,
  },
}));
