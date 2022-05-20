import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

import {ButchObj} from "../Butch/ButchObj"

type MeasureData =
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | undefined;

export default function useComponentData(butchObj: ButchObj | undefined) {
  const [data, setData] = useState<MeasureData>(undefined);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setData({ x, y, width, height });
    if (butchObj) {
      butchObj.extension.coords = {x: x, y: y};
      butchObj.extension.size = {width: width, height: height};
    }
  }, []);

  return [data, onLayout] as const;
}
