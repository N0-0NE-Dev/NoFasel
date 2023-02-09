import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import ContentCardsList from "../components/ContentCardsList";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleButton from "../components/ToggleButton";
import { useTheme, Text, ActivityIndicator } from "react-native-paper";

const SearchScreen = ({ navigation }) => {
	const common = require("../data/common.json");
	const categories = common.categories;
	const genres = common.genres;
	const theme = useTheme();

	const [searchText, setSearchText] = useState("");
	const [allData, setAllData] = useState(null);
	const [featuredContent, setFeaturedContent] = useState(null);
	const bottomSheetRef = useRef(null);
	const [appliedFilters, setAppliedFilters] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [data, setData] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "all-content.json"
		).then((allData) => setAllData(JSON.parse(allData)));
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "featured-content.json"
		).then((featuredContent) => {
			setFeaturedContent(JSON.parse(featuredContent));
			setData(JSON.parse(featuredContent).content);
		});
	}, []);

	const applyFilter = (item) => {
		const genreIntersection = item["Genres"].filter((value) =>
			selectedGenres.includes(value)
		);
		if (
			appliedFilters.includes(item["Category"]) ||
			genreIntersection.length > 0
		) {
			return item;
		} else {
			// pass
		}
	};

	useEffect(() => {
		if (allData && featuredContent) {
			if (searchText !== "") {
				var searched = allData.content.filter((item) => {
					if (
						item["Title"].toLowerCase().includes(searchText.toLocaleLowerCase())
					) {
						return item;
					} else {
						// pass
					}
				});
			} else {
				// pass
			}

			if (appliedFilters.length !== 0 || selectedGenres.length !== 0) {
				const toUse = searchText === "" ? allData.content : searched;
				const filtered = toUse.filter(applyFilter);
				setData(filtered);
			} else {
				if (searchText !== "") {
					setData(searched);
				} else {
					setData(featuredContent.content);
				}
			}
		} else {
			// pass
		}
	}, [searchText, appliedFilters, selectedGenres]);

	if (data !== null) {
		return (
			<View style={{ flex: 1 }}>
				<View style={styles.searchBarParentStyle}>
					<TextInput
						placeholder="Search"
						mode="flat"
						style={styles.searchBarStyle}
						left={<TextInput.Icon icon="magnify" color="grey" />}
						underlineColor="transparent"
						activeUnderlineColor="transparent"
						cursorColor="black"
						onChangeText={(text) => setSearchText(text)}
					/>
					<FontAwesome
						name="sliders"
						size={27}
						color={theme.colors.primary}
						style={{
							...styles.iconStyle,
							backgroundColor: theme.colors.elevation.level4,
						}}
						onPress={() => bottomSheetRef.current.open()}
					/>
				</View>

				{data.length === 0 && searchText !== "" ? (
					<View style={styles.imageParentStyle}>
						<Image
							source={require("../assets/NotFound.png")}
							style={{ width: 860 * 0.4, height: 571 * 0.4 }}
						/>
						<Text
							style={{
								...styles.notFoundTextStyle,
								color: theme.colors.primary,
							}}
						>
							Not Found
						</Text>
						<Text style={styles.descriptionTextStyle}>
							Sorry, the keywords you entered could not be found. Try to check
							again or search with different keywords.
						</Text>
					</View>
				) : (
					<ContentCardsList
						data={data}
						horizontal={false}
						formatted={true}
						width={180}
						height={270}
						navigation={navigation}
					/>
				)}

				<RBSheet
					ref={bottomSheetRef}
					closeOnDragDown={true}
					closeOnPressMask={true}
					height={800}
					customStyles={{
						wrapper: {
							backgroundColor: "rgba(0, 0, 0, 0.75)",
						},
						draggableIcon: {
							backgroundColor: theme.colors.primary,
						},
						container: {
							borderRadius: 30,
							backgroundColor: theme.colors.background,
						},
					}}
				>
					<Text style={styles.filterTitleStyle}>Filter</Text>
					<View style={styles.separatorStyle} />
					<Text style={styles.filterSectionStyle}>Categories</Text>
					<View style={{ flexWrap: "wrap", flexDirection: "row" }}>
						{categories.map((category) => (
							<ToggleButton
								title={category.label}
								filters={appliedFilters}
								setFilters={setAppliedFilters}
								value={category.key}
								key={category.key}
							/>
						))}
					</View>
					<Text style={styles.filterSectionStyle}>Genre</Text>
					<ScrollView
						contentContainerStyle={{
							flexWrap: "wrap",
							flexDirection: "row",
						}}
					>
						{genres.map((genre) => (
							<ToggleButton
								title={genre}
								filters={selectedGenres}
								setFilters={setSelectedGenres}
								value={genre}
								key={genre}
							/>
						))}
					</ScrollView>
				</RBSheet>
			</View>
		);
	} else {
		return (
			<View style={styles.activityIndicatorParentStyle}>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	searchBarStyle: {
		margin: 20,
		marginRight: 10,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		flex: 1,
	},
	iconStyle: {
		marginRight: 20,
		borderRadius: 15,
		padding: 15,
	},
	activityIndicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	searchBarParentStyle: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	filterTitleStyle: {
		fontSize: 26,
		fontWeight: "bold",
		textAlign: "center",
		padding: 15,
		letterSpacing: 1.15,
	},
	separatorStyle: {
		borderBottomColor: "#ddd",
		borderBottomWidth: 3,
		flex: 1,
		width: Dimensions.get("window").width * 0.875,
		alignSelf: "center",
	},
	filterSectionStyle: {
		fontSize: 24,
		fontWeight: "bold",
		margin: 15,
	},
	imageParentStyle: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
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

export default SearchScreen;
