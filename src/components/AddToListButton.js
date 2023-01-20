import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const AddToListButton = () => {
	return (
		<Pressable style={styles.parentStyle}>
			<AntDesign name="plus" size={18} color="white" style={styles.iconStyle} />
			<Text style={styles.textStyle}>My List</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	parentStyle: {
		flexDirection: "row",
		marginBottom: 20,
		marginLeft: 20,
		alignItems: "center",
		justifyContent: "center",
		width: 125,
		borderRadius: 15,
		paddingVertical: 3,
		borderColor: "white",
		borderWidth: 2,
	},
	textStyle: {
		fontWeight: "bold",
		paddingHorizontal: 10,
		color: "white",
		fontSize: 18,
	},
	iconStyle: {
		paddingLeft: 10,
	},
});

export default AddToListButton;
