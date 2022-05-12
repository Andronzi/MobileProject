import React, { useState } from "react"
import {  
	ScrollView, 
	Text, 
	View
} from "react-native"
import { makeStyles, useTheme } from "@rneui/themed"

import { ButchBuilder } from "src/Butch/Butch";
import { Navigator } from "./StackNav"
import ToolBar, { LeftArrow } from "./SimpleToolbar"

type props = {
	builder: ButchBuilder,
	navigator: Navigator 
}

const ConsoleScreen: React.FC<props> = ({ 
	builder, 
	navigator
}) => {
	const [textStream, setTextStream] = useState({ id: "", value: "" });

	const { theme } = useTheme(),
		styles = useStyles(theme);
	
	if (!textStream.id)
		textStream.id = builder.useOutStream({ 
			write: (str: string) => {
				setTextStream(prev => { 
					return { id: prev.id, value: prev.value + str };
				});
		}});

	return (
		<View>
			<ToolBar>
				<LeftArrow onPress={navigator.goBack} />
			</ToolBar>
			<ScrollView style={styles.win}>
				<Text style={styles.text}>
					{textStream.value}  
				</Text>
			</ScrollView>   
		</View>
	)
}

const useStyles = makeStyles(theme => ({
	win: {
		backgroundColor: theme.colors?.black, 
		width: "100%",
		height: "100%",
		paddingLeft: 10
	},
	text: {
		color: "white",
		fontSize: 16,
	}
}))

export default ConsoleScreen;