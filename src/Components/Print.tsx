import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "../hooks/useComponentData";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { useDNDElements } from "./DroppablesData";
import { Block } from "../Components/Block";
import Draggable from "./Draggable";
import { DataPicker } from "./DataPicker";

interface BlockProps {
  item: ButchObj;
}

export default function PrintBlock({ item }: BlockProps) {
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
      <DataPicker item={item} style={styles.container}>
        <Block style={{ padding: 10 }}>
          <Text style={styles.blockText}>{item.type}</Text>
        </Block>
        {/* <Droppable content={item.content} /> */}
      </DataPicker>
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
    fontSize: 18,
    marginLeft: 10,
    backgroundColor: "#F4EEFF",
    color: "#424874",
  },
}));
