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
					backgroundColor: pressed ? "#111" : null,
				},
				{
					flexDirection: "row",
					padding: 25,
					alignItems: "center",
				},
			]}>
			<Icon name={iconName} size={26} color={theme.colors.primary} />
			<Text
				style={{
					fontSize: fontSize,
					paddingHorizontal: 25,
					fontWeight: "bold",
					color: theme.colors.primary,
				}}>
				{label}
			</Text>
		</Pressable>
	);
};

export default DefaultSettingsButton;
