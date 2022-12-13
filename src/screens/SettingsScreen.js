import React, { useState } from "react";
import { View, Switch, Text, StyleSheet, Button } from "react-native";
import { Storage } from "../components/Storage";
import { StatusBar } from "expo-status-bar";

const SettingsScreen = ({ navigation }) => {
	const [automaticContentUpdates, setAutomaticContentUpdates] = useState(
		Storage.getBoolean("contentAutoupdate")
	);

	const [useProxy, setUseProxy] = useState(Storage.getBoolean("useProxy"));

	const handleContentUpdates = () => {
		Storage.set("contentAutoupdate", !automaticContentUpdates);
		setAutomaticContentUpdates(!automaticContentUpdates);
	};

	const handleUseProxy = () => {
		Storage.set("useProxy", !useProxy);
		setUseProxy(!useProxy);
	};

	return (
		<View>
			<StatusBar style="dark" />

			<View style={styles.switchParentStyle}>
				<Text style={styles.textStyle}>Automatic Content Updates</Text>
				<Switch
					onValueChange={handleContentUpdates}
					value={automaticContentUpdates}
				/>
			</View>

			<View style={styles.switchParentStyle}>
				<View>
					<Text style={styles.textStyle}>Use Proxy For Akwam</Text>
					<Text style={{ fontSize: 11, padding: 5, color: "grey" }}>
						Bypasses akwam blocking in certain regions.
					</Text>
				</View>
				<Switch onValueChange={handleUseProxy} value={useProxy} />
			</View>

			<View style={styles.buttonParentStyle}>
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
	switchParentStyle: {
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
	buttonParentStyle: {
		width: 150,
		margin: 20,
		alignSelf: "center",
	},
});

export default SettingsScreen;
