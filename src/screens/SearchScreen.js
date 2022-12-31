import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import { Storage } from "../components/Storage";
import StyledModalSelector from "../components/StyledModalSelector";

const darkTheme = Storage.getBoolean("darkTheme");

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchTerm, setSearchTerm] = useState();
	const [allData, setAllData] = useState();
	const [filter, setFilter] = useState("all");

	const selectorData = [
		{ label: "All", key: "all" },
		{ label: "Movies", key: "movies" },
		{ label: "Series", key: "series" },
		{ label: "Anime", key: "anime" },
		{ label: "Asian Series", key: "asian-series" },
		{ label: "TV Shows", key: "tvshows" },
		{ label: "Arabic Series", key: "arabic-series" },
		{ label: "Arabic Movies", key: "arabic-movies" },
	];

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + "all-content.json"
		).then((data) => setAllData(JSON.parse(data)));
	}, []);

	let data = jsonQuery(`content[*Title~/^.*${searchTerm}.*$/i]`, {
		data: allData,
		allowRegexp: true,
	}).value;

	if (searchTerm === "") {
		data = [];
	} else {
		// pass
	}

	if (data !== null && filter != "all") {
		data = data.filter((element) => element["Category"] == filter);
	} else {
		// pass
	}

	if (allData) {
		return (
			<View style={styles.parentStyle}>
				<TextInput
					style={styles.textInputStyle}
					placeholder="Search"
					onChangeText={setSearchTerm}
					placeholderTextColor="#BEBEBE"
					autoFocus={true}
				/>
				<StyledModalSelector
					data={selectorData}
					selectedKey={filter}
					handleChange={(option) => setFilter(option.key)}
				/>
				<ContentCardsList
					navigation={navigation}
					data={data}
					horizontal={false}
					formatted={true}
				/>
			</View>
		);
	} else {
		return (
			<View>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	textInputStyle: {
		borderWidth: 1,
		padding: 10,
		textAlign: "center",
		margin: 10,
		color: darkTheme ? "white" : "black",
		borderColor: darkTheme ? "white" : "black",
	},
	parentStyle: {
		flex: 1,
	},
	modalSelectorStyle: {
		borderColor: darkTheme ? "white" : "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		borderRadius: 5,
		marginBottom: 5,
	},
});

export default SearchScreen;
