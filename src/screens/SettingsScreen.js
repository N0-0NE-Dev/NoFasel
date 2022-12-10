import React, { useState } from "react";
import { View, Switch, Text, StyleSheet, Button } from "react-native";
import { Storage } from "../components/Storage";
import { StatusBar } from "expo-status-bar";

const SettingsScreen = ({ navigation }) => {
	const [automaticContentUpdates, setAutomaticContentUpdates] = useState(
		Storage.getBoolean("contentAutoupdate")
	);

	const handleContentUpdates = () => {
		Storage.set("contentAutoupdate", !automaticContentUpdates);
		setAutomaticContentUpdates(!automaticContentUpdates);
	};

	return (
		<View>
			<StatusBar style="dark" />
			<View style={styles.parentStyle}>
				<Text style={styles.textStyle}>Automatic Content Updates</Text>
				<Switch
					onValueChange={handleContentUpdates}
					value={automaticContentUpdates}
				/>
			</View>

			<View style={{ width: 150, margin: 20, alignSelf: "center" }}>
				<Button
					title="Update Content"
					onPress={() => navigation.navigate("Loading")}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		fontSize: 18,
		margin: 5,
		color: "black",
	},
	parentStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "#BEBEBE",
		margin: 10,
		padding: 5,
		paddingVertical: 20,
	},
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
});

export default SettingsScreen;
