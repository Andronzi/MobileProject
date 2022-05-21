import React, { useState, useContext, useRef, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  LayoutRectangle,
  Modal
} from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import blocksState from "../Data/blocksState";
import { RenderObj } from "./RenderObj";
import AddButton from "./BlockUI/AddButton";

import { FunctionBlock } from "../Components/Function";

import { ButchObj } from "../Butch/ButchObj";
import BlockSelector from "./BlockUI/BlockSelector";

const ScrollViewRefContext = React.createContext<React.RefObject<ScrollView> | null>(null);

function useScrollViewRef(): React.RefObject<ScrollView> | null {
  return useContext(ScrollViewRefContext);
}

export const BlocksList: React.FC<{ objToRender: ButchObj }> = ({ objToRender }) => {
  const [isVisible, setVisible] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle>();
  // const [selectorVisible, setSelectorVisible] = useState(false);

  const appendObj = useCallback((obj: ButchObj) => {
    if (objToRender.content)
      objToRender.content = [...objToRender.content, obj]
  }, [objToRender])

  const closeSelector = useCallback(
    () => setVisible(false), 
    [setVisible]
  );

  const { theme } = useTheme();
  const styles = useStyles(theme);

  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <View
      onLayout={({ nativeEvent }) => {
        setLayout(nativeEvent.layout);
      }}>
      {!isVisible ? (
        <AddButton
          onPress={() => {
            setVisible(true);
          }}
          parentLatout={layout}
        />
      ) : undefined}

      <Modal 
        animationType = "fade"
        transparent={true}
        visible={isVisible}
        presentationStyle="overFullScreen"
        onRequestClose={closeSelector}
      >
        <BlockSelector 
          choices={[
            ["while", () => appendObj(objToRender.createWhile())],
            ["for", () => appendObj(objToRender.createFor())],
            ["print", () => appendObj(objToRender.createPrint())],
            ["expression", () => appendObj(objToRender.createExpression())],
            ["declare",() => appendObj(objToRender.createDeclare())],
            ["return",() => appendObj(objToRender.createReturn())],
            ["break",() => appendObj(objToRender.createBreak())]
          ]}
          onDefault={closeSelector}
          onClose={closeSelector}
        />
      </Modal>
      {/* Vlad create cool component, so instead ScrollView:
          <CoolComponent obj={objToRender} />
         */}
      <ScrollView style={isVisible ? styles.darkCommonView : styles.commonView}>
        <ScrollViewRefContext.Provider value={scrollViewRef}>
          <Text>{JSON.stringify(objToRender && objToRender.data)}</Text>
          {/* <FunctionBlock item={objToRender} /> */}
          <RenderObj />
        </ScrollViewRefContext.Provider>
      </ScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  commonView: {
    backgroundColor: theme.colors?.grey4,
  },

  darkCommonView: {
    opacity: 0.15,
    backgroundColor: theme.colors?.grey0,
    zIndex: 200,
  },

  renderView: {
    width: "100%",
  },

  modal: {
    padding: 20,
    marginTop: "20%",
    minHeight: "60%",
    backgroundColor: theme.colors?.background,
  },

  text: {
    fontSize: 18,
  },

  blocksSelectView: {
    flexDirection: "row",
  },

  selectionBlock: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors?.grey4,
  },

  selectionText: {
    color: theme.colors?.white,
    textAlign: "center",
    fontSize: 16,
  },

  modalAddButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    backgroundColor: theme.colors?.success,
  },

  modalCloseButton: {
    padding: 10,
    backgroundColor: "#FF3333",
  },
}));
