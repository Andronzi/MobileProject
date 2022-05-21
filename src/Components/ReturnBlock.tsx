import React from "react";
import { Text } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Block } from "../Components/Block";
import { DataPicker } from "./DataPicker";

interface BlockProps {
  item: ButchObj;
}

export default function ReturnBlock({ item }: BlockProps) {
  const { theme } = useTheme();
  const styles = useStyles(theme);

  return (
    <DataPicker item={item}>
      <Block style={{ padding: 10 }}>
        <Text style={styles.blockText}>{item.type}</Text>
        <Text style={[styles.inputText]}>{item.content ? item.content[0].get("value") : ""}</Text>
      </Block>
      {/* <Droppable content={item.content} /> */}
    </DataPicker>
  );
}

const useStyles = makeStyles(theme => ({
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
    padding: 10
  },
}));