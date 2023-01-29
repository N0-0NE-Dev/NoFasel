import React, { useState, useEffect, useRef } from "react";
import {
	View,
	StyleSheet,
	ActivityIndicator,
	Text,
	Dimensions,
	ScrollView,
} from "react-native";
import { TextInput } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import ContentCardsList from "../components/ContentCardsList";
import RBSheet from "react-native-raw-bottom-sheet";
import ToggleButton from "../components/ToggleButton";

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchText, setSearchText] = useState("");
	const [allData, setAllData] = useState(null);
	const [featuredContent, setFeaturedContent] = useState(null);
	const bottomSheetRef = useRef(null);
	const [appliedFilters, setAppliedFilters] = useState([]);
	const [selectedGenres, setSelectedGenres] = useState([]);
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);

	const categories = [
		{ label: "Movies", key: "movies" },
		{ label: "Series", key: "series" },
		{ label: "Anime", key: "anime" },
		{ label: "Asian Series", key: "asian-series" },
		{ label: "TV Shows", key: "tvshows" },
		{ label: "Arabic Series", key: "arabic-series" },
		{ label: "Arabic Movies", key: "arabic-movies" },
	];

	const genres = [
		"Netflix",
		"Ramadan",
		"Fantasy",
		"Music",
		"Reality-tv",
		"News",
		"Youth",
		"Psychological",
		"Family",
		"N-a",
		"History",
		"Crime",
		"Sport",
		"Life",
		"Mystery",
		"Drama",
		"Biography",
		"Science Fiction",
		"Zombies",
		"Animation",
		"Adventure",
		"Film-noir",
		"Animated",
		"Romance",
		"School",
		"Friendship",
		"Comdey",
		"Sports",
		"Kids",
		"Western",
		"Musical",
		"Talk-show",
		"Melodrama",
		"Dubbed",
		"Game-show",
		"Office",
		"War",
		"Comedy",
		"Thriller",
		"Horror",
		"Documentary",
		"Sci-fi",
		"Short",
		"Action",
		"Supernatural",
	];

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "all-content.json"
		).then((allData) => setAllData(JSON.parse(allData)));
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "featured-content.json"
		).then((featuredContent) =>
			setFeaturedContent(JSON.parse(featuredContent))
		);
	}, []);

	useEffect(() => {
		setData(
			jsonQuery(`content[*Title~/^.*${searchText}.*$/i]`, {
				data: allData,
				allowRegexp: true,
			}).value
		);
	}, [searchText, appliedFilters, selectedGenres]);

	useEffect(() => {
		console.log(data);
		if (appliedFilters.length > 0 || selectedGenres.length > 0) {
			const test = data.filter((item) =>
				appliedFilters.includes(item["Category"])
			);
			setFilteredData(test);
		} else {
			setFilteredData([]);
		}
	}, [appliedFilters, selectedGenres, data]);

	// useEffect(() => {
	// 	if (appliedFilters.length > 0 || selectedGenres.length > 0) {
	// 		const temp = data
	// 		setData(temp.filter(isIn));
	// 	}
	// }, [appliedFilters, selectedGenres, allData, searchText]);

	if (allData && featuredContent) {
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
						color="red"
						style={styles.iconStyle}
						onPress={() => bottomSheetRef.current.open()}
					/>
				</View>

				<ContentCardsList
					data={
						(searchText === "") &
						(appliedFilters.length === 0) &
						(selectedGenres.length === 0)
							? Object.entries(featuredContent)
							: filteredData.length !== 0 || selectedGenres.length !== 0
							? filteredData
							: data
					}
					horizontal={false}
					formatted={
						(searchText === "") &
						(appliedFilters.length === 0 || selectedGenres.length === 0)
							? false
							: true
					}
					width={180}
					height={270}
					navigation={navigation}
				/>

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
							backgroundColor: "#ddd",
						},
						container: {
							borderRadius: 30,
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
		<View style={styles.activityIndicatorParentStyle}>
			<ActivityIndicator size={50} />
		</View>;
	}
};

const styles = StyleSheet.create({
	searchBarStyle: {
		margin: 20,
		marginRight: 10,
		borderRadius: 10,
		borderTopRightRadius: 10,
		borderTopLeftRadius: 10,
		backgroundColor: "#eee",
		flex: 1,
	},
	iconStyle: {
		marginRight: 20,
		backgroundColor: "rgba(255, 0, 0, 0.1)",
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
		color: "red",
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
});

export default SearchScreen;
