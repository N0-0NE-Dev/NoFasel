import React, { useState } from "react";
import { View, Modal, StyleSheet, Pressable } from "react-native";
import { Storage } from "../components/Storage";
import { useTheme, Dialog, Text, Button } from "react-native-paper";

const StartupScreen = () => {
	const theme = useTheme();
	const [languaDialogVisible, setLanguaDialogVisible] = useState(true);
	const languages = require("../data/common.json").languagsData;

	const hideDialog = () => setLanguaDialogVisible(false);

	return (
		<Dialog visible={languaDialogVisible} onDismiss={hideDialog}>
			<Dialog.Title>Alert</Dialog.Title>
			<Dialog.Content>
				<Text>This is simple dialog</Text>
			</Dialog.Content>
			<Dialog.Actions>
				<Button onPress={hideDialog}>Done</Button>
			</Dialog.Actions>
		</Dialog>
	);
};

const styles = StyleSheet.create({
	modalBackgroundStyle: {
		backgroundColor: "rgba(0,0,0,0.5)",
		position: "absolute",
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	modalViewStyle: {
		marginHorizontal: 20,
		borderRadius: 20,
		alignItems: "center",
	},
});

export default StartupScreen;
