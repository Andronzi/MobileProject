import React, { useEffect, useRef, useState } from "react";
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Button,
  Pressable
} from "react-native";
import { useTheme, makeStyles, Icon } from '@rneui/themed';

import blocksState from "../Data/blocksState"; 
import { RenderObj } from "./RenderObj";
import { Dimensions } from "react-native";

const addButtonSize = 60;

export const BlocksList: React.FC = () => {
  const [addButtonPos, setAddButtonPos] = useState({ right: 20, bottom: 20 })
  const [isVisible, setVisible] = useState(false);
  const [blockType, setBlockType] = useState('');
  const [blockName, setBlockName] = useState('');
  const [blockValue, setBlockValue] = useState('');

  const selfRef = useRef(null);

  const block: any = blocksState;

  const { theme } = useTheme();
  const styles = useStyles(theme);
  
  const onPressEvent = (content: {
    id: number | string, 
    type: string, name: 
    string, 
    value: string
  }) => {
    block[content.id] = {
      type: content.type,
      name: content.name,
      content: {
        1: {
          type: 'text', value: content.value
        }
      }
    }
  }
  
  useEffect(() => {
    setBlockName('');
    setBlockValue('');
    console.log(block);
  }, [block]) 

  return (
    <View ref={selfRef}
      onLayout={({ nativeEvent }) => {
        setAddButtonPos(prev => ({ 
          ...prev, 
          bottom: nativeEvent.layout.y + nativeEvent.layout.height
            - Dimensions.get("window").height + 20
        }));
    }}>
      { !isVisible ? (
          <View style={[styles.addButton, addButtonPos]} >
            <TouchableOpacity onPress={() => {setVisible(true)}}>
              <Icon 
                name="plus"
                type="entypo"
                size={addButtonSize}
              />
            </TouchableOpacity>
          </View>
        ) : undefined }

      <Modal
        animationType = {"fade"}
        transparent={true}
        visible={isVisible}
        presentationStyle="overFullScreen"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.blocksSelectView}>
            <TouchableOpacity style={styles.selectionBlock} onPress={() => setBlockType('function')}>
              <Text style={styles.selectionText}>Function</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.selectionBlock} onPress={() => setBlockType('declare')}>
              <Text style={styles.selectionText}>Declare</Text>
            </TouchableOpacity>
          </View>
          <TextInput placeholder="name" value={blockName} onChangeText={(text) => setBlockName(text)}/>
          <TextInput placeholder="value" value={blockValue} onChangeText={(text) => setBlockValue(text)}/>
          <Pressable style={styles.modalAddButton} onPress={() => {
            onPressEvent({id: Date.now(), type: blockType, name: blockName, value: blockValue});
          }}>
            <Text style={styles.selectionText}>Add</Text>
            {/* <Icon name="close" type="antdesign"/>     */}
          </Pressable>
          <Pressable style={styles.modalCloseButton} onPress={() => {
            setBlockType(''); setBlockName(''); setBlockValue(''); setVisible(!isVisible);}}
          >
            <Text style={styles.selectionText}>Close Modal</Text>
          </Pressable>
        </View>
      </Modal>
      <ScrollView style={isVisible ? styles.darkCommonView : styles.commonView}>
        <RenderObj/>
      </ScrollView>
    </View>  
  )
}

const useStyles = makeStyles((theme) => ({
  commonView: {
    backgroundColor: theme.colors?.grey0
  },

  darkCommonView: {
    opacity: 0.15,
    backgroundColor: theme.colors?.grey0,
    zIndex: 200
  },

  renderView: {
    width: '100%'
  },

  modal: {
    padding: 20,
    marginTop: '20%',
    minHeight: '60%',
    backgroundColor: theme.colors?.background
  },

  text: {
    fontSize: 18
  },

  blocksSelectView: {
    flexDirection: 'row',
  },

  selectionBlock: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: theme.colors?.grey4
  },

  selectionText: {
    color: theme.colors?.white,
    textAlign: 'center',
    fontSize: 16
  },

  modalAddButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: theme.colors?.success
  },

  modalCloseButton: {
    padding: 10,
    backgroundColor: '#FF3333'
  },

  addButton: {
    backgroundColor: theme.colors?.secondary, 
    borderRadius: 50,
    position: "absolute", 
    zIndex: 100,

    elevation: 5,
    shadowColor: theme.colors?.black
  }
}));
