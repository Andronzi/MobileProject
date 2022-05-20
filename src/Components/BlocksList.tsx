import React, { useEffect, useState, useContext, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Pressable,
  LayoutRectangle,
} from "react-native";
import { useTheme, makeStyles } from "@rneui/themed";

import blocksState from "../Data/blocksState";
import { RenderObj } from "./RenderObj";
import AddButton from "./AddButton";
import { FunctionBlock } from "../Components/Function";

import { ButchObj } from "src/Butch/ButchObj";

const ScrollViewRefContext = React.createContext<React.RefObject<ScrollView> | null>(null);

function useScrollViewRef(): React.RefObject<ScrollView> | null {
  return useContext(ScrollViewRefContext);
}

export const BlocksList: React.FC<{ objToRender: ButchObj }> = ({ objToRender }) => {
  const [isVisible, setVisible] = useState(false);
  const [blockType, setBlockType] = useState("");
  const [blockName, setBlockName] = useState("");
  const [blockValue, setBlockValue] = useState("");
  const [layout, setLayout] = useState<LayoutRectangle>();

  const block: any = blocksState;

  const { theme } = useTheme();
  const styles = useStyles(theme);

  const scrollViewRef = useRef<ScrollView>(null);

  const onPressEvent = (content: {
    id: number | string;
    type: string;
    name: string;
    value: string;
  }) => {
    block[content.id] = {
      type: content.type,
      name: content.name,
      content: {
        1: {
          type: "text",
          value: content.value,
        },
      },
    };
  };

  useEffect(() => {
    setBlockName("");
    setBlockValue("");
  }, [block]);

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

      {/* This Modal must be redone after component builder apear */}
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={isVisible}
        presentationStyle="overFullScreen"
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modal}>
          <View style={styles.blocksSelectView}>
            <TouchableOpacity
              style={styles.selectionBlock}
              onPress={() => setBlockType("function")}>
              <Text style={styles.selectionText}>Function</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionBlock} onPress={() => setBlockType("declare")}>
              <Text style={styles.selectionText}>Declare</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="name"
            value={blockName}
            onChangeText={text => setBlockName(text)}
          />
          <TextInput
            placeholder="value"
            value={blockValue}
            onChangeText={text => setBlockValue(text)}
          />
          <Pressable
            style={styles.modalAddButton}
            onPress={() => {
              onPressEvent({ id: Date.now(), type: blockType, name: blockName, value: blockValue });
            }}>
            <Text style={styles.selectionText}>Add</Text>
            {/* <Icon name="close" type="antdesign"/>     */}
          </Pressable>
          <Pressable
            style={styles.modalCloseButton}
            onPress={() => {
              setBlockType("");
              setBlockName("");
              setBlockValue("");
              setVisible(!isVisible);
            }}>
            <Text style={styles.selectionText}>Close Modal</Text>
          </Pressable>
        </View>
      </Modal>
      {/* Vlad create cool component, so instead ScrollView:
          <CoolComponent obj={objToRender} />
         */}
      <ScrollView style={isVisible ? styles.darkCommonView : styles.commonView}>
        <ScrollViewRefContext.Provider value={scrollViewRef}>
          <Text>{JSON.stringify(objToRender)}</Text>
          <FunctionBlock item={objToRender} />
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
