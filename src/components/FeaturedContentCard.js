import React from "react";
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	ImageBackground,
} from "react-native";
import PlayButton from "./PlayButton";
import AddToListButton from "./AddToListButton";

const FeaturedContentCard = ({ title, imageSource }) => {
	return (
		<View>
			<ImageBackground source={{ uri: imageSource }} style={styles.imageStyle}>
				<Text style={styles.titleStyle}>{title}</Text>
				<View style={styles.buttonsParentStyle}>
					<PlayButton />
					<AddToListButton />
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	imageStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.4,
		flex: 1,
		justifyContent: "flex-end",
	},
	titleStyle: {
		color: "white",
		margin: 20,
		fontSize: 24,
		fontWeight: "bold",
		letterSpacing: 1.25,
	},
	buttonsParentStyle: {
		flexDirection: "row",
	},
});

export default FeaturedContentCard;
