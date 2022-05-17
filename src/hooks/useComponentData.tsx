import { useState, useCallback } from "react";
import { LayoutChangeEvent } from "react-native";

type MeasureData =
  | {
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | undefined;

export default function useComponentData() {
  const [data, setData] = useState<MeasureData>(undefined);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setData({ x, y, width, height });
  }, []);

  return [data, onLayout] as const;
}
