import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, ScrollView, Image } from "react-native";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleButton from "../components/ToggleButton";
import { useTheme, Text, Button } from "react-native-paper";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import ContentCard from "../components/ContentCard";

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
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(20);
	const pageNumber = end / 20;

	const handleNext = () => {
		setStart(end);
		setEnd(end + 20);
	};

	const handlePrevious = () => {
		if (start !== 0) {
			setStart(start - 20);
			setEnd(end - 20);
		} else {
			// pass
		}
	};

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
		setStart(0);
		setEnd(20);
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
			<ScrollView>
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
							style={{ width: 860 * 0.3, height: 571 * 0.3 }}
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
					<ScrollView
						horizontal={true}
						contentContainerStyle={{
							flexWrap: "wrap",
							flex: 1,
							justifyContent: "center",
						}}
					>
						{data.slice(start, end).map((item) => (
							<ContentCard
								width={180}
								height={270}
								navigation={navigation}
								id={item["key"]}
								category={item["Category"]}
								title={item["Title"]}
								rating={item["Rating"]}
								imageSource={item["Image Source"]}
								key={item["key"]}
							/>
						))}
					</ScrollView>
				)}

				{data.length > 20 && (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						{start > 0 && (
							<Button
								icon="chevron-left"
								mode="outlined"
								style={{ borderColor: "rgba(0, 0, 0, 0)" }}
								labelStyle={{ fontSize: 15 }}
								onPress={handlePrevious}
							>
								Previous
							</Button>
						)}
						<Text>{pageNumber}</Text>
						{end < data.length && (
							<Button
								mode="outlined"
								icon="chevron-right"
								style={{ borderColor: "rgba(0, 0, 0, 0)" }}
								contentStyle={{ flexDirection: "row-reverse" }}
								labelStyle={{ fontSize: 15 }}
								onPress={handleNext}
							>
								Next
							</Button>
						)}
					</View>
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
			</ScrollView>
		);
	} else {
		return <CentredActivityIndicator />;
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
		alignItems: "center",
		flex: 1,
		borderColor: "white",
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

export default SearchScreen;
