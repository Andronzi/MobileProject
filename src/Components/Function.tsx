import React, { useContext } from "react";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "src/hooks/useComponentData";
import { View } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import Droppable from "./Droppable";
import { useDNDElements } from "./DroppablesData";

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
      <Title title={item.codes} name=""></Title>
      <Droppable content={item.content} />
    </View>
  );
}

const useStyles = makeStyles(theme => ({
  container: { marginBottom: 10 },
}));
