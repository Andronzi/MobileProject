import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import { ButchObj } from "../Butch/ButchObj";
import useComponentData from "../hooks/useComponentData";
import { Children, IStyle } from "../types/Types";

interface DataPickerProps {
  item: ButchObj;
  style?: IStyle;
  children: Children;
}

export function DataPicker({ item, children, style }: DataPickerProps) {
  const [, onLayout] = useComponentData(item);
  const selfRef = useRef<View>(null);
  useEffect(() => {
    selfRef?.current?.measure((fx, fy, width, height, px, py) => {
      item.extension.coords = { px, py };
      item.extension.size = { width, height };
    });
  });

  return (
    <View ref={selfRef} onLayout={onLayout} style={style}>
      {children}
    </View>
  );
}
