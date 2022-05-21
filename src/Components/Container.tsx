import React from "react";
import { Text, TextInput } from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";
import PropTypes from "prop-types";

import { ButchObj } from "../Butch/ButchObj";
import { DataPicker } from "./DataPicker";
import { Children } from "../types/Types";

interface ContainerProps {
  item: ButchObj;
  children: Children;
}

export default function Container({ item, children }: ContainerProps) {
  return <DataPicker item={item}>{children}</DataPicker>;
}

Container.propTypes = {
  children: PropTypes.any,
  item: PropTypes.array,
};
