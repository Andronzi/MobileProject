import React, { useContext } from "react";
import { View } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "src/hooks/useComponentData";
import Droppable from "./Droppable";
import { useDNDElements } from "./DroppablesData";
// import { Title } from "../Components/Title";
import { Block } from "../Components/Block";

interface FunctionalBlockProps {
  item: ButchObj;
}

function FunctionBlock({ item }: FunctionalBlockProps) {
  const theme = useTheme();
  const styles = useStyles(theme);
  const context = useDNDElements();
  const [sizeAndCoords, onLayout] = useComponentData(item);

  return (
    <View onLayout={onLayout} style={styles.container}> 
      {/* <Title title="function" name={item.get("name")} nameSeq={item.get("nameSeq")} /> */}
      <Block children={["function", item.get("name"), item.get("nameSeq")]} style={{margin: 0, color: "white"}}/>
      <Droppable content={item.content} />
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: { marginBottom: 10 },
}));
