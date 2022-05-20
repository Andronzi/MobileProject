import React from "react"
import { View, TouchableOpacity } from "react-native"
import { useTheme, makeStyles, Icon } from "@rneui/themed"

export const DefaultHeight = 50;

export const LeftArrow: React.FC<{ onPress: () => void }> = ({ onPress }) => (
	<TouchableOpacity 
		activeOpacity={0.3} 
		onPress={onPress} 
		style={{ marginHorizontal: 5, marginVertical: 5 }}
		>
		<Icon name="chevron-thin-left" type="entypo" size={30}/>
	</TouchableOpacity>
)

const ToolBar: React.FC<{ 
	children?: React.ReactNode,
	extraStyle?: object,
 }> = ({ children, extraStyle }) => {
	const { theme } = useTheme(), styles = useStyle(theme);

	return <View style={[styles.toolbar, extraStyle]}>
		{ children }
	</View>
}

const useStyle = makeStyles(theme => ({
		toolbar: {
			backgroundColor: theme.colors?.primary,
			minHeight: 20,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: "center",
			height: DefaultHeight
		}
}));

export default ToolBar;