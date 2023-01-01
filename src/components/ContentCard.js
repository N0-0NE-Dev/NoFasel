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
			<Image
				style={styles.logoStyle}
				source={
					category.includes("arabic")
						? require("../assets/Akwam.png")
						: require("../assets/Fasel.png")
				}
			/>
			<Image style={styles.imageStyle} source={{ uri: imageSource }} />
			<Text numberOfLines={1} style={styles.textStyle}>
				{title}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	patentStyle: {
		width: 180,
		margin: 5,
	},
	imageStyle: {
		width: 180,
		height: 270,
	},
	textStyle: {
		textAlign: "center",
		fontSize: 16,
		color: darkTheme ? "white" : "black",
	},
	logoStyle: {
		width: 80,
		height: 25,
		position: "absolute",
		zIndex: 1,
		alignSelf: "flex-end",
	},
});

export default ContentCard;
