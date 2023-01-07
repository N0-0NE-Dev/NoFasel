import React, { useEffect, useState } from "react";
import {
	View,
	Switch,
	Text,
	StyleSheet,
	Button,
	ToastAndroid,
	Pressable,
	ActivityIndicator
} from "react-native";
import { Storage } from "../components/Storage";
import RNRestart from "react-native-restart";
import StyledModalSelector from "../components/StyledModalSelector";
import deviceInfoModule from "react-native-device-info";
import * as FileSystem from "expo-file-system";

const darkTheme = Storage.getBoolean("darkTheme");

const SettingsScreen = ({ navigation }) => {
	const [automaticContentUpdates, setAutomaticContentUpdates] = useState(
		Storage.getBoolean("contentAutoupdate")
	);

	const [useProxy, setUseProxy] = useState(Storage.getBoolean("useProxy"));
	const [theme, setTheme] = useState(darkTheme ? "dark" : "light");
	const [contentVersion, setContentVersion] = useState(null);

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
			ToastAndroid.show("Already applied!", ToastAndroid.SHORT);
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

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "last-scraped.txt"
		).then((data) =>
			setContentVersion(data.replaceAll("-", ".").replace("20", ""))
		);
	}, []);

	if (contentVersion) {
		return (
			<View style={styles.parentStyle}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? darkTheme
									? "#3a3b3c"
									: "#ddd"
								: null,
						},
						styles.switchParentStyle,
					]}
					onPress={handleContentUpdates}
				>
					<Text style={styles.textStyle}>Automatic Content Updates</Text>
					<Switch
						onValueChange={handleContentUpdates}
						value={automaticContentUpdates}
					/>
				</Pressable>

				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? darkTheme
									? "#3a3b3c"
									: "#ddd"
								: null,
						},
						styles.switchParentStyle,
					]}
					onPress={handleUseProxy}
				>
					<View>
						<Text style={styles.textStyle}>Use Proxy For Akwam</Text>
						<Text style={styles.indicatorParentStyle}>
							Bypasses akwam blocking in certain regions.
						</Text>
					</View>
					<Switch onValueChange={handleUseProxy} value={useProxy} />
				</Pressable>

				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<Text style={styles.infoStyle}>
						Content Version: {contentVersion}
					</Text>

					<Text style={styles.infoStyle}>
						App Version: {deviceInfoModule.getVersion()}
					</Text>
				</View>

				<StyledModalSelector
					handleChange={(option) => handleTheme(option.key)}
					data={selectorData}
					selectedKey={theme}
				/>

				<View style={styles.buttonParentStyle}>
					<Button
						title="Update Content"
						onPress={() => navigation.navigate("Loading")}
					/>
				</View>
			</View>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<ActivityIndicator size={50} />
			</View>
		);
	}
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
	infoStyle: {
		color: "grey",
		margin: 15,
	},
	infoParentStyle: {
		fontSize: 11,
		padding: 5,
		color: "grey",
	},
});

export default SettingsScreen;
