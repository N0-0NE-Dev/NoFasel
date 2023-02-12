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
				size={32}
				color={theme.colors.primary}
			/>
			<Text
				style={{
					fontSize: 20,
					fontWeight: "bold",
					color: theme.colors.primary,
					paddingHorizontal: 25,
				}}
			>
				{label}
			</Text>
		</Pressable>
	);
};

export default DefaultSettingsButton;
