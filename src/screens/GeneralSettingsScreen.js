import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text, Switch } from "react-native-paper";
import { Storage } from "../components/Storage";
import DefaultSettingsButton from "../components/DefaultSettingsButton";
import RNRestart from "react-native-restart";

const GeneralSettingsScreen = ({ navigation }) => {
	const theme = useTheme();
	const [useProxy, setUseProxy] = useState(Storage.getBoolean("useProxy"));

	const toggleUseProxy = () => {
		Storage.set("useProxy", !useProxy);
		setUseProxy(!useProxy);
	};

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<Pressable
				onPress={toggleUseProxy}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? (theme.dark ? "#3a3b3c" : "#ddd") : null,
					},
					{
						flexDirection: "row",
						justifyContent: "space-between",
						padding: 25,
					},
				]}
			>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
					}}
				>
					Use Proxy for Akwam
				</Text>
				<Switch value={useProxy} onValueChange={toggleUseProxy} />
			</Pressable>
			<DefaultSettingsButton
				label="Change Provider"
				fontSize={18}
				iconName="closed-caption"
				onPress={() => {
					Storage.delete("provider");
					Storage.delete("preferedLanguage");
					RNRestart.Restart();
				}}
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
