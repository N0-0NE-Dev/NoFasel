import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const PlayButton = ({ navigation, category, id }) => {
	return (
		<Pressable
			style={styles.parentStyle}
			onPress={() =>
				navigation.navigate("Select", {
					category: category,
					id: id,
				})
			}
		>
			<AntDesign name="play" size={16} color="white" />
			<Text style={styles.textStyle}>Play</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	parentStyle: {
		flexDirection: "row",
		marginBottom: 20,
		marginLeft: 20,
		backgroundColor: "red",
		alignItems: "center",
		justifyContent: "center",
		width: 100,
		borderRadius: 15,
	},
	textStyle: {
		fontWeight: "bold",
		paddingHorizontal: 10,
		color: "white",
		fontSize: 16,
	},
});

export default PlayButton;
