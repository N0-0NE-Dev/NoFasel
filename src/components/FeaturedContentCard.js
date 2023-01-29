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
import LinearGradient from "react-native-linear-gradient";

const FeaturedContentCard = ({ title, imageSource, genres }) => {
	return (
		<ImageBackground source={{ uri: imageSource }} style={styles.imageStyle}>
			<LinearGradient colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}>
				<Text style={styles.titleStyle}>{title}</Text>

				<View style={styles.genresParentStyle}>
					{genres.map((genre) => (
						<Text key={genre} style={styles.genreTextStyle}>
							{genre}
						</Text>
					))}
				</View>

				<View style={styles.buttonsParentStyle}>
					<PlayButton />
					<AddToListButton />
				</View>
			</LinearGradient>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	imageStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.4,
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "transparent",
	},
	titleStyle: {
		color: "white",
		marginLeft: 20,
		marginBottom: 10,
		fontSize: 24,
		fontWeight: "bold",
		letterSpacing: 1.25,
		backgroundColor: "transparent",
	},
	buttonsParentStyle: {
		flexDirection: "row",
		backgroundColor: "transparent",
	},
	genresParentStyle: {
		flexDirection: "row",
		marginLeft: 20,
		marginBottom: 20,
	},
	genreTextStyle: {
		color: "white",
		marginRight: 10,
		fontSize: 16,
		fontWeight: "250",
	},
});

export default FeaturedContentCard;
