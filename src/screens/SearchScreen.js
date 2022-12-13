import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ActivityIndicator } from "react-native";
import ContentCardsList from "../components/ContentCardsList";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";
import ModalSelector from "react-native-modal-selector";

const SearchScreen = ({ navigation }) => {
	let jsonQuery = require("json-query");
	const [searchTerm, setSearchTerm] = useState();
	const [allData, setAllData] = useState();
	const [filter, setFilter] = useState("none");

	const selectorData = [
		{ label: "None", key: "none" },
		{ label: "Movies", key: "movies" },
		{ label: "Series", key: "series" },
		{ label: "Anime", key: "anime" },
		{ label: "Asian Series", key: "asian-series" },
		{ label: "TV Shows", key: "tvshows" },
		{ label: "Arabic Series", key: "arabic-series" },
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

	if (data !== null && filter != "none") {
		data = data.filter((element) => element["Category"] == filter);
	} else {
		// pass
	}

	if (allData) {
		return (
			<View style={styles.parentStyle}>
				<StatusBar style="dark" />
				<TextInput
					style={styles.textInputStyle}
					placeholder="Search"
					onChangeText={setSearchTerm}
					placeholderTextColor="#BEBEBE"
				/>
				<ModalSelector
					data={selectorData}
					initValue="Filter"
					onChange={(option) => setFilter(option.key)}
					style={styles.modalSelectorStyle}
					initValueTextStyle={styles.initValueTextStyle}
					backdropPressToClose={true}
					selectedKey={filter}
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
				<StatusBar style="dark" />
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
		color: "black",
	},
	parentStyle: {
		flex: 1,
	},
	modalSelectorStyle: {
		borderColor: "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		borderRadius: 5,
		marginBottom: 5,
	},
	initValueTextStyle: {
		color: "blue",
	},
});

export default SearchScreen;
