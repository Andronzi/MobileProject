import { useState, useCallback } from "react";

type MeasureData = {
  x: number;
  y: number;
  width: number;
  height: number;
} | null;

const useComponentData = () => {
  const [data, setData] = useState<MeasureData>(null);

  const onLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setData({ x, y, width, height });
  }, []);

  return [data, onLayout];
};
