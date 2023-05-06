import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "react-native-paper";
import { Storage } from "../components/Storage";
import DefaultSettingsButton from "../components/DefaultSettingsButton";
import DefaultSettingsSwitch from "../components/DefaultSettingsSwitch";
import RNRestart from "react-native-restart";

const GeneralSettingsScreen = ({ navigation }) => {
	const theme = useTheme();
	const [useProxy, setUseProxy] = useState(Storage.getBoolean("useProxy"));
	const [pureBlack, setPureBlack] = useState(Storage.getBoolean("pureBlack"));

	const toggleUseProxy = () => {
		Storage.set("useProxy", !useProxy);
		setUseProxy(!useProxy);
	};

	const togglePureBlack = () => {
		Storage.set("pureBlack", !pureBlack);
		setPureBlack(!pureBlack);
		RNRestart.restart();
	};

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}>
			<DefaultSettingsSwitch
				color={theme.colors.primary}
				text="AMOLED Theme"
				value={pureBlack}
				onValueChange={togglePureBlack}
			/>
			<DefaultSettingsSwitch
				color={theme.colors.primary}
				text="Use Proxy for Akwam"
				value={useProxy}
				onValueChange={toggleUseProxy}
			/>
			<DefaultSettingsButton
				label="Force Update Content"
				iconName="update"
				onPress={() => navigation.navigate("Loading")}
			/>
		</View>
	);
};

export default GeneralSettingsScreen;
