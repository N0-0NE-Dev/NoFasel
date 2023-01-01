import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Footer from "../components/Footer";
import PageNumberEntryModal from "../components/PageNumberEntryModal";
import ContentCardsList from "../components/ContentCardsList";
import { isTablet } from "react-native-device-info";
import * as FileSystem from "expo-file-system";
import { Storage } from "../components/Storage";
import StyledModalSelector from "../components/StyledModalSelector";

const darkTheme = Storage.getBoolean("darkTheme");

const AllContentScreen = ({ navigation }) => {
	const [data, setData] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const tablet = isTablet();
	const offset = tablet ? 20 : 10;

	const [pageConfigs, setPageConfigs] = useState({
		startPage: 0,
		endPage: offset,
		pageNumber: 1,
	});

	const [pageNumberInput, setPageNumberInput] = useState(1);

	const [contentData, setContentData] = useState({
		label: "Movies",
		key: "movies",
	});

	const getLastPageNumber = () => {
		const numberOfEntries = Math.floor(Object.entries(data).length);
		const numberOfPgaes = numberOfEntries / offset;
		const flooredNumberOfPages = Math.floor(numberOfPgaes);
		const firstDecimal = numberOfPgaes.toString().split(".")[1];

		if (Number(firstDecimal) > 0) {
			return flooredNumberOfPages + 1;
		} else {
			return flooredNumberOfPages;
		}
	};

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + contentData.key + ".json"
		).then((data) => setData(JSON.parse(data)));
	}, [contentData]);

	if (data) {
		var lastPageNumber = getLastPageNumber();
	} else {
		// pass
	}

	const selectorData = [
		{ label: "Movies", key: "movies" },
		{ label: "Series", key: "series" },
		{ label: "Anime", key: "anime" },
		{ label: "Asian Series", key: "asian-series" },
		{ label: "TV Shows", key: "tvshows" },
		{ label: "Arabic Series", key: "arabic-series" },
		{ label: "Arabic Movies", key: "arabic-movies" },
	];

	useEffect(() => {
		setPageConfigs({
			startPage: 0,
			endPage: offset,
			pageNumber: 1,
		});
	}, [contentData]);

	const handleNext = () => {
		if (pageConfigs.pageNumber < lastPageNumber) {
			setPageConfigs({
				startPage: pageConfigs.startPage + offset,
				endPage: pageConfigs.endPage + offset,
				pageNumber: pageConfigs.pageNumber + 1,
			});
		} else {
			// pass
		}
	};

	const handlePrevious = () => {
		if (pageConfigs.pageNumber > 1) {
			const offset = tablet ? 20 : 10;
			setPageConfigs({
				startPage: pageConfigs.startPage - offset,
				endPage: pageConfigs.endPage - offset,
				pageNumber: pageConfigs.pageNumber - 1,
			});
		} else {
			// pass
		}
	};

	const viewModal = () => {
		setModalVisible(true);
	};

	const handleSubmission = () => {
		const properNumber = Number(pageNumberInput);

		if (properNumber <= lastPageNumber && pageNumberInput > 0) {
			setPageConfigs({
				startPage: (properNumber - 1) * offset,
				endPage: properNumber * offset,
				pageNumber: properNumber,
			});
			setModalVisible(false);
		} else {
			// pass
		}
	};

	const handleCancellation = () => {
		setModalVisible(false);
	};

	if (data) {
		return (
			<View style={styles.parentStyle}>
				<PageNumberEntryModal
					modalVisible={modalVisible}
					setPageNumberInput={setPageNumberInput}
					pageNumberInput={pageNumberInput}
					handleCancellation={handleCancellation}
					handleSubmission={handleSubmission}
					lastPageNumber={lastPageNumber}
				/>
				<StyledModalSelector
					data={selectorData}
					selectedKey={contentData.key}
					handleChange={(option) => setContentData(option)}
				/>
				<ContentCardsList
					horizontal={false}
					category={contentData.key}
					navigation={navigation}
					data={Object.entries(data).slice(
						pageConfigs.startPage,
						pageConfigs.endPage
					)}
				/>
				<Footer
					handleNext={handleNext}
					handlePrevious={handlePrevious}
					pageNumber={pageConfigs.pageNumber}
					handleModal={viewModal}
					lastPageNumber={lastPageNumber}
				/>
			</View>
		);
	} else {
		return (
			<View style={styles.parentStyle}>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	modalSelectorStyle: {
		borderColor: darkTheme ? "white" : "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		margin: 10,
		borderRadius: 5,
	},
	initValueTextStyle: {
		color: "blue",
	},
	parentStyle: {
		flex: 1,
		justifyContent: "center",
	},
});

export default AllContentScreen;
