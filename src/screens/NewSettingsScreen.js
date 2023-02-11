import React from "react";
import { View, Pressable } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const NewSettingsScreen = ({ navigation }) => {
	const theme = useTheme();

	const DefaultButton = ({ label, onPress, iconName }) => {
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

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<DefaultButton
				label="General Settings"
				onPress={() => navigation.navigate("General Settings")}
				iconName="cogs"
			/>
		</View>
	);
};

export default NewSettingsScreen;
