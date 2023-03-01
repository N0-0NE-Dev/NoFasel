import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DefaultSettingsButton from "../components/DefaultSettingsButton";

const NewSettingsScreen = ({ navigation }) => {
	return (
		<SafeAreaView
			style={{
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
		</SafeAreaView>
	);
};

export default NewSettingsScreen;
