import React from "react";
import { Pressable, Image, StyleSheet } from "react-native";
import { Storage } from "./Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const ContentCard = ({
	navigation,
	imageSource,
	id,
	category,
	width,
	height,
}) => {
	const styles = StyleSheet.create({
		patentStyle: {
			width: width,
			margin: 5,
		},
		imageStyle: {
			width: width,
			height: height,
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

export default ContentCard;
