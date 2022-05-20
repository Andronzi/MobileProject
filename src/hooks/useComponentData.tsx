import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

import { ButchObj } from "../Butch/ButchObj";

type MeasureData =
  | {
      width: number;
      height: number;
    }
  | undefined;

export default function useComponentData(butchObj: ButchObj | undefined) {
  const [data, setData] = useState<MeasureData>(undefined);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setData({ width, height });
    if (butchObj) {
      butchObj.extension.size = { width, height };
    }
  }, []);

  return [data, onLayout] as const;
}
