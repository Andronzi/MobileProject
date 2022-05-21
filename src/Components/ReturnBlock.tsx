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
    <DataPicker item={item} style={styles.container}>
      <Block>
        <Text style={[styles.blockText, { padding: 10 }]}>{item.type}</Text>
        <Text style={[styles.inputText]}>{item.content ? item.content[0].get("value") : ""}</Text>
      </Block>
      {/* <Droppable content={item.content} /> */}
    </DataPicker>
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
