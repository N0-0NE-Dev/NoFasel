import React, { useState } from "react";
import {
	View,
	Switch,
	Text,
	StyleSheet,
	Button,
	ToastAndroid,
} from "react-native";
import { Storage } from "../components/Storage";
import ModalSelector from "react-native-modal-selector";
import RNRestart from "react-native-restart";

const darkTheme = Storage.getBoolean("darkTheme");

const SettingsScreen = ({ navigation }) => {
	const [automaticContentUpdates, setAutomaticContentUpdates] = useState(
		Storage.getBoolean("contentAutoupdate")
	);

	const [useProxy, setUseProxy] = useState(Storage.getBoolean("useProxy"));
	const [theme, setTheme] = useState(darkTheme ? "dark" : "light");

	const selectorData = [
		{ label: "Dark Theme", key: "dark" },
		{ label: "Light Theme", key: "light" },
	];

	const handleContentUpdates = () => {
		Storage.set("contentAutoupdate", !automaticContentUpdates);
		setAutomaticContentUpdates(!automaticContentUpdates);
	};

	const handleUseProxy = () => {
		Storage.set("useProxy", !useProxy);
		setUseProxy(!useProxy);
	};

	const handleTheme = (selectedTheme) => {
		if (selectedTheme == theme) {
			ToastAndroid.show("Already Applied", ToastAndroid.SHORT);
		} else {
			if (selectedTheme == "dark") {
				Storage.set("darkTheme", true);
				setTheme("dark");
			} else {
				Storage.set("darkTheme", false);
				setTheme("light");
			}
			ToastAndroid.show("Refreshing...", ToastAndroid.SHORT);
			RNRestart.Restart();
		}
	};

	return (
		<View style={styles.parentStyle}>
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

			<ModalSelector
				data={selectorData}
				onChange={(option) => handleTheme(option.key)}
				style={styles.modalSelectorStyle}
				selectedKey={theme}
				backdropPressToClose={true}
				selectTextStyle={{ color: darkTheme ? "white" : "black" }}
				optionContainerStyle={{
					backgroundColor: darkTheme ? "black" : "white",
					borderColor: darkTheme ? "white" : "black",
					borderWidth: 1,
				}}
				optionTextStyle={{ color: darkTheme ? "#add8e6" : "blue" }}
				cancelText="Cancel"
				cancelStyle={{
					backgroundColor: darkTheme ? "black" : "white",
					borderWidth: 1,
					borderColor: darkTheme ? "white" : "black",
				}}
				cancelTextStyle={{ color: darkTheme ? "white" : "black" }}
			/>

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
		color: darkTheme ? "white" : "black",
	},
	switchParentStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderWidth: 1,
		borderColor: "#bebebe",
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
	parentStyle: {
		flex: 1,
	},
	modalSelectorStyle: {
		borderColor: "black",
		borderWidth: 1,
		width: 300,
		alignSelf: "center",
		margin: 10,
		borderRadius: 5,
	},
});

export default SettingsScreen;
