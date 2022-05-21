import React from "react";
import { Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import { Droppable } from "../Utilities/ProgramBlockLayout";
import { Block } from "../Components/Block";
import { DataPicker } from "./DataPicker";
import Draggable from "./Draggable";

// import {
//   ConditionalBlock,
//   ForLoopBlock,
//   FunctionBlock,
//   DeclarationBlock,
//   WhileLoopBlock,
//   ExpressionBlock,
//   ReturnBlock,
//   PrintBlock,
// } from "../Modules/ProgramBlocks.d";

interface FunctionalBlockProps {
  item: ButchObj;
}

export default function FunctionBlock({ item }: FunctionalBlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);

  // console.log(item.content);

  return (
    <Draggable item={item} style={styles.container}>
      <DataPicker item={item}>
        {/* <Title title="function" name={item.get("name")} nameSeq={item.get("nameSeq")} /> */}
        <Block
          // children={["function", item.get("name"), item.get("nameSeq")]}
          style={{ padding: 10 }}>
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
      </DataPicker>
    </Draggable>
    // <View ref={selfRef} onLayout={onLayout} style={styles.container}>
    //   {/* <Title title="function" name={item.get("name")} nameSeq={item.get("nameSeq")} /> */}
    //   <Block
    //     style={{ margin: 0}}>
    //     <Text style={styles.blockText}>{item.type}</Text>
    //     <TextInput style={styles.inputText} placeholder="name" value={item.get("name")} />
    //     {item.type === "function" && item.get("nameSeq").map(item => (
    //       <TextInput style={styles.inputText} placeholder="argument" value={item} />
    //     ))}
    //   </Block>
    //   <Droppable content={item.content} />
    // </View>
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
  },
}));
