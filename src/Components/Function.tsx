import React, { useEffect, useRef } from "react";
import { View, Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "../hooks/useComponentData";
import Droppable from "./Droppable";
import { useDNDElements } from "./DroppablesData";
import { Block } from "../Components/Block";

interface FunctionalBlockProps {
  item: ButchObj;
}

export function FunctionBlock({ item }: FunctionalBlockProps) {
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

  return (
    <View ref={selfRef} style={styles.container}>
      {/* <Title title="function" name={item.get("name")} nameSeq={item.get("nameSeq")} /> */}
      <Block
        // children={["function", item.get("name"), item.get("nameSeq")]}
        style={{ margin: 0, color: "white" }}>
        <Text style={styles.blockText}>function</Text>
        <TextInput style={styles.inputText} placeholder="name" value={item.get("name")} />
        {item.get("nameSeq").map(item => {
          return (
            <>
              <TextInput style={styles.inputText} placeholder="argument" value={item} />
            </>
          );
        })}
      </Block>
      <Droppable content={item.content} />
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: { marginBottom: 10 },
  blockText: {
    color: "#F4EEFF",
  },

  inputText: {
    color: "#424874",
  },
}));
