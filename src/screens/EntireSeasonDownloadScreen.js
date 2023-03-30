import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";
import ReactNativeBlobUtil from "react-native-blob-util";
import ContentCard from "../components/ContentCard";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { getPaletteSync } from "@assembless/react-native-material-you";

const EntireSeasonDownloadScreen = ({ navigation }) => {
	const theme = useTheme();

	const [data, setData] = useState(null);
	const [featured, setFeatured] = useState(null);
	const [searchText, setSearchText] = useState("");
	const [use, setUse] = useState([]);
	const palette = getPaletteSync();

	useEffect(() => {
		ReactNativeBlobUtil.fs
			.readFile(ReactNativeBlobUtil.fs.dirs.DocumentDir + "/WeCima.json")
			.then(data => {
				const parsedData = Object.entries(JSON.parse(data));
				setData(parsedData);
				setFeatured(
					parsedData.splice(parsedData.length - 11, parsedData.length),
				);
				setUse(parsedData.splice(parsedData.length - 11, parsedData.length));
			});
	}, []);

	useEffect(() => {
		if (data && searchText != "") {
			var searched = data.filter(item => {
				if (
					item[1]["Title"]
						.toLowerCase()
						.includes(searchText.toLocaleLowerCase())
				) {
					return item;
				} else {
					// pass
				}
			});

			if (searched.length > 0) {
				setUse(searched);
			} else {
				setUse(false);
			}
		} else {
			// pass
		}
	}, [searchText]);

	useEffect(() => {
		if (searchText === "") {
			setUse(featured);
		} else {
			// pass
		}
	}, [searchText]);

	if (data && featured) {
		return (
			<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
				<View style={styles.searchBarParentStyle}>
					<TextInput
						placeholder="Search"
						mode="flat"
						style={{
							...styles.iconStyle,
							backgroundColor: theme.colors.elevation.level4,
						}}
						left={
							<TextInput.Icon
								icon="magnify"
								iconColor={palette.system_accent1[6]}
							/>
						}
						underlineColor="transparent"
						activeUnderlineColor="transparent"
						cursorColor="black"
						onChangeText={text => setSearchText(text)}
					/>
				</View>

				{use ? (
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							justifyContent: "center",
						}}>
						{use.map(item => {
							return (
								<ContentCard
									imageSource={
										item[1]["Image Source"]
											? item[1]["Image Source"]
											: "https://imgpile.com/images/TPDrVl.jpg"
									}
									title={
										item[1]["Title"] + " season " + item[1]["Season Number"]
									}
									id={item[1]["Source"]}
									width={180}
									height={270}
									rating={`S${item[1]["Season Number"]}`}
									category={"WeCima"}
									navigation={navigation}
									key={item[0]}
								/>
							);
						})}
					</View>
				) : (
					<View style={styles.imageParentStyle}>
						<Image
							source={require("../assets/NotFound.png")}
							style={{ width: 860 * 0.3, height: 571 * 0.3 }}
						/>
						<Text
							style={{
								...styles.notFoundTextStyle,
								color: theme.colors.primary,
							}}>
							Not Found
						</Text>
						<Text style={styles.descriptionTextStyle}>
							Sorry, the keywords you entered could not be found. Try to check
							again or search with different keywords.
						</Text>
					</View>
				)}
			</ScrollView>
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

const styles = StyleSheet.create({
	searchBarStyle: {
		margin: 20,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		flex: 1,
	},
	searchBarParentStyle: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	iconStyle: {
		marginRight: 20,
		borderRadius: 15,
		padding: 15,
	},
	imageParentStyle: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	notFoundTextStyle: {
		fontWeight: "bold",
		fontSize: 26,
		margin: 20,
	},
	descriptionTextStyle: {
		textAlign: "center",
		marginHorizontal: 10,
		fontSize: 16,
		letterSpacing: 0.75,
	},
});

export default EntireSeasonDownloadScreen;
