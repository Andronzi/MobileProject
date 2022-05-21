import { makeStyles, useTheme } from "@rneui/themed"
import React from "react"
import { Modal, View, Text, Button } from "react-native"

const Error: React.FC<{ 
  message: string,
  onClose: () => void,
  visible: boolean 
}> = ({ 
  message,
  visible,
  onClose 
}) => {
  const { theme } = useTheme(), styles = useStyles(theme);

  return <Modal
    transparent={true}
    visible={visible}
    presentationStyle="overFullScreen"
    onRequestClose={onClose}
  >
    <View style={styles.window}>
      <Text style={styles.text}>{ message }</Text>
      <Button title="Close" onPress={onClose} />
    </View>
  </Modal>
}

const useStyles = makeStyles(theme => ({
  window: {
    backgroundColor: theme.colors.disabled,
    margin: 50,
    padding: 20,
    borderRadius: 5
  },
  text: {
    color: theme.colors.error,
    fontSize: 24,
  }
}))

export default Error;