import React from "react";
import { Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DefaultSettingsButton = ({ label, onPress, iconName, fontSize = 18 }) => {
	const theme = useTheme();

	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? (theme.dark ? "#3a3b3c" : "#ddd") : null,
				},
				{
					flexDirection: "row",
					padding: 25,
					alignItems: "center",
				},
			]}>
			<Icon name={iconName} size={26} color={theme.dark ? "white" : "black"} />
			<Text
				style={{
					fontSize: fontSize,
					paddingHorizontal: 25,
					fontWeight: "bold",
				}}>
				{label}
			</Text>
		</Pressable>
	);
};

export default DefaultSettingsButton;
