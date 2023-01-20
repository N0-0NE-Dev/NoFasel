import React from "react";
import { Pressable, Image, Text, StyleSheet } from "react-native";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const ContentCard = ({ navigation, imageSource, title, id, category }) => {
	return (
		<Pressable
			style={styles.patentStyle}
			onPress={() =>
				navigation.navigate("Select", { id: id, category: category })
			}
		>
			<Image style={styles.imageStyle} source={{ uri: imageSource }} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	patentStyle: {
		width: 400 * 0.35,
		margin: 5,
	},
	imageStyle: {
		width: 400 * 0.35,
		height: 600 * 0.35,
		borderRadius: 15,
		marginTop: 3,
	},
	textStyle: {
		textAlign: "center",
		fontSize: 16,
		color: darkTheme ? "white" : "black",
		marginBottom: 3,
	},
});

export default ContentCard;
