import React from "react";
import { Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const DefaultSettingsButton = ({ label, onPress, iconName }) => {
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
			]}
		>
			<MaterialCommunityIcons
				name={iconName}
				size={26}
				color={theme.dark ? "white" : "black"}
			/>
			<Text
				style={{
					fontSize: 18,
					paddingHorizontal: 25,
				}}
			>
				{label}
			</Text>
		</Pressable>
	);
};

export default DefaultSettingsButton;
