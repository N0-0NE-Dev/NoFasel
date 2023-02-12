import React from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import DefaultSettingsButton from "../components/DefaultSettingsButton";

const NewSettingsScreen = ({ navigation }) => {
	const theme = useTheme();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<DefaultSettingsButton
				label="General Settings"
				onPress={() => navigation.navigate("General Settings")}
				iconName="cogs"
			/>
			<DefaultSettingsButton
				label="About"
				onPress={() => navigation.navigate("About")}
				iconName="information"
			/>
		</View>
	);
};

export default NewSettingsScreen;
