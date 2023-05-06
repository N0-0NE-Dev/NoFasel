import React from "react";
import { Pressable, Text } from "react-native";
import { Switch } from "react-native-paper";

const DefaultSettingsSwitch = ({ color, text, value, onValueChange }) => {
	return (
		<Pressable
			onPress={onValueChange}
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? "111" : null,
				},
				{
					flexDirection: "row",
					justifyContent: "space-between",
					padding: 25,
				},
			]}>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					color: color,
				}}>
				{text}
			</Text>
			<Switch value={value} onValueChange={onValueChange} />
		</Pressable>
	);
};

export default DefaultSettingsSwitch;
