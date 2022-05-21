import React, { useRef, useState } from "react"
import {  
	ScrollView, 
	Text, 
	View
} from "react-native"
import { makeStyles, useTheme } from "@rneui/themed"

import { ButchBuilder } from "src/Butch/Butch";
import { Navigator } from "../StackNav"
import ToolBar, { LeftArrow } from "../SimpleToolbar"
import { useMemo } from "react";

type props = {
	builder: ButchBuilder,
	navigator: Navigator,
	callback?: () => void,
	doClearing?: () => boolean 
}

const ConsoleScreen: React.FC<props> = ({ 
	builder, 
	navigator,
	doClearing
}) => {	
	const scrollView = useRef<ScrollView>(null)
	const [textStream, setTextStream] = useState({ id: "", value: "" });
	if (doClearing && doClearing()) {
		setTextStream(prev => ({ ...prev, value: "" }));
	}

	if (!textStream.id) {
		textStream.id = builder.useOutStream({ 
			write: (str: string) => {
				setTextStream(prev => { 
					return { id: prev.id, value: prev.value + str };
				});
		}});
	}

	const { theme } = useTheme(), styles = useStyles(theme);

	const textContent = useMemo(() => (
			<Text style={styles.text}>
				{textStream.value}  
			</Text>
		), [ textStream ]
	)
	
	return (
		<View>
			<ToolBar>
				<LeftArrow onPress={() => navigator.goBack()} />
			</ToolBar>
			<ScrollView 
				style={styles.win} 
				ref={scrollView}
				onLayout={() => {
					scrollView.current?.scrollToEnd();
				}}
			>
				{/* <Text style={styles.text}>
					{textStream.value}  
				</Text> */}
				{ textContent }
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