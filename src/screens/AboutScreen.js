import React, { useState, useEffect } from "react";
import DefaultSettingsButton from "../components/DefaultSettingsButton";
import { View, Linking } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { getVersion } from "react-native-device-info";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import * as FileSystem from "expo-file-system";

const AboutScreen = () => {
	const theme = useTheme();
	const [contentVersion, setContentVersion] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "last-scraped.txt"
		).then((data) =>
			setContentVersion(data.replaceAll("-", ".").replace("20", ""))
		);
	}, []);

	if (contentVersion) {
		return (
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<DefaultSettingsButton
					label="Content Information Source"
					onPress={() => Linking.openURL("https://www.themoviedb.org/")}
				/>
				<DefaultSettingsButton
					label="App Source Code"
					onPress={() =>
						Linking.openURL("https://github.com/N0-0NE-Dev/NoFasel")
					}
				/>
				<DefaultSettingsButton
					label="Scrapers Source Code"
					onPress={() =>
						Linking.openURL("https://github.com/N0-0NE-Dev/no-fasel-scrapers")
					}
				/>
				<DefaultSettingsButton
					label="App Design"
					onPress={() =>
						Linking.openURL(
							"https://www.behance.net/gallery/145850337/Mova-Movie-Streaming-App-UI-Kit?tracking_source=search_projects%7CVideo+Streaming+App"
						)
					}
				/>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						margin: 15,
					}}
				>
					<Text style={{ fontSize: 12, color: "grey" }}>
						Content Version: {contentVersion}
					</Text>
					<Text style={{ fontSize: 12, color: "grey" }}>
						App Version: {getVersion()}
					</Text>
				</View>
			</View>
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

export default AboutScreen;
