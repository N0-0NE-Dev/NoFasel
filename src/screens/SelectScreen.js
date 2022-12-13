import React, { useEffect, useState } from "react";
import {
	Text,
	Image,
	View,
	StyleSheet,
	ActivityIndicator,
	Button,
	ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import ModalSelector from "react-native-modal-selector";
import * as FileSystem from "expo-file-system";
import { StatusBar } from "expo-status-bar";
import { Storage } from "../components/Storage";

const SelectScreen = ({ navigation, route }) => {
	const { id, category } = route.params;
	const contentWithSeasons = ["series", "tvshows", "asian-series"];
	const jsCode =
		"window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)";

	const useProxy = Storage.getBoolean("useProxy");

	const [data, setData] = useState(null);

	const [pageSource, setPageSource] = useState(null);
	const [contentSource, setContentSource] = useState(null);

	const [qualities, setQualities] = useState(null);
	const [selectedQuality, setSelectedQuality] = useState(null);

	const [seasons, setSeasons] = useState(null);
	const [selectedSeason, setSelectedSeason] = useState(null);

	const [episodes, setEpisodes] = useState(null);
	const [selectedEpisode, setSelectedEpisode] = useState(null);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + category + ".json"
		).then((data) => setData(JSON.parse(data)));
	}, []);

	if (data) {
		var content = data[id];
	} else {
		// pass
	}

	const getSources = () => {
		if (pageSource) {
			let HTMLParser = require("fast-html-parser");
			let root = HTMLParser.parse(pageSource);
			let dataUrls = [];

			root.querySelectorAll(".quality_change").forEach((button) => {
				button.childNodes.pop();
				button.childNodes.shift();

				button.childNodes.forEach((node) => {
					const dataUrl = Object.entries(node)[1]
						.toString()
						.split(" ")[2]
						.split("=")[1];

					if (dataUrl.includes("master")) {
						dataUrls.push({ label: "Auto", key: dataUrl });
					} else if (dataUrl.includes("hd1080b")) {
						dataUrls.push({ label: "1080p", key: dataUrl });
					} else if (dataUrl.includes("hd720b")) {
						dataUrls.push({ label: "720p", key: dataUrl });
					} else if (dataUrl.includes("sd576b")) {
						dataUrls.push({ label: "576p", key: dataUrl });
					} else if (dataUrl.includes("sd480b")) {
						dataUrls.push({ label: "480p", key: dataUrl });
					} else if (dataUrl.includes("sd360b")) {
						dataUrls.push({ label: "360p", key: dataUrl });
					} else {
						// pass
					}
				});
			});

			setQualities(dataUrls);
		} else {
			// pass
		}
	};

	const getSeriesEpisodes = (season) => {
		const episodes = [];
		let toUse = null;

		if (contentWithSeasons.includes(category)) {
			toUse = content["Seasons"][season]["Episodes"];
		} else if ((category == "anime") | (category == "arabic-series")) {
			toUse = content["Episodes"];
		} else {
			// pass
		}

		Object.entries(toUse).forEach((episode) => {
			episodes.push({
				label: `Episode ${episode[1]["Episode Number"]}`,
				key: episode[1]["Source"],
			});
		});

		setEpisodes(episodes);
	};

	const getSeasons = () => {
		const seasons = [];
		Object.entries(content["Seasons"]).forEach((season) =>
			seasons.push({
				label: `Season ${season[1]["Season Number"]}`,
				key: `${season[0]}`,
			})
		);
		setSeasons(seasons);
	};

	useEffect(() => {
		if (contentWithSeasons.includes(category) && data) {
			getSeasons();
		} else {
			// pass
		}
	}, [data]);

	useEffect(() => {
		if (data) {
			if (selectedSeason) {
				getSeriesEpisodes(selectedSeason);
			} else if ((category == "anime") | (category == "arabic-series")) {
				getSeriesEpisodes();
			} else {
				// pass
			}
		} else {
			// pass
		}
	}, [selectedSeason, data]);

	useEffect(() => {
		if (category == "movies" && data) {
			setTimeout(() => setContentSource(content["Source"]), 250);
		} else if (selectedEpisode && category != "arabic-series") {
			setSelectedQuality(null);
			setQualities(null);
			setContentSource(selectedEpisode);
		} else if (selectedEpisode && category == "arabic-series") {
			setQualities(null);
			setSelectedQuality(null);
			fetch(
				useProxy
					? `https://api.codetabs.com/v1/proxy?quest=${selectedEpisode}`
					: selectedEpisode
			)
				.then((resp) => resp.text())
				.then((text) => {
					let HTMLParser = require("fast-html-parser");
					let root = HTMLParser.parse(text);
					const rawSources = root.querySelectorAll("source");
					const sources = [];

					rawSources.forEach((source) => {
						sources.push({
							label: source.attributes.size + "p",
							key: '"' + source.attributes.src + '"',
						});
					});

					setQualities(sources);
				})
				.catch((e) => console.error(e));
		}
	}, [data, selectedEpisode]);

	useEffect(() => {
		if (pageSource) {
			getSources();
		} else {
			// pass
		}
	}, [pageSource]);

	const SeasonSelector = () => {
		if (contentWithSeasons.includes(category) && seasons) {
			return (
				<ModalSelector
					data={seasons}
					initValue="Select A Season"
					onChange={(option) => setSelectedSeason(option.key)}
					initValueTextStyle={styles.initValueTextStyle}
					style={styles.modalSelectorStyle}
					selectedKey={selectedSeason}
					backdropPressToClose={true}
				/>
			);
		} else {
			// pass
		}
	};

	const EpisodeSelector = () => {
		if (episodes) {
			return (
				<ModalSelector
					data={episodes}
					initValue="Select An Episode"
					onChange={(option) => setSelectedEpisode(option.key)}
					initValueTextStyle={styles.initValueTextStyle}
					style={styles.modalSelectorStyle}
					selectedKey={selectedEpisode}
					backdropPressToClose={true}
				/>
			);
		} else {
			// pass
		}
	};

	const QualitySelector = () => {
		if (qualities) {
			return (
				<ModalSelector
					data={qualities}
					initValue="Select A Quality"
					onChange={(option) => setSelectedQuality(option.key)}
					initValueTextStyle={styles.initValueTextStyle}
					style={styles.modalSelectorStyle}
					selectedKey={selectedQuality}
					backdropPressToClose={true}
				/>
			);
		} else if (contentSource && category != "arabic-series") {
			return (
				<View>
					<ActivityIndicator size={50} />
					<WebView
						source={{ uri: contentSource }}
						injectedJavaScript={jsCode}
						onMessage={(event) => setPageSource(event.nativeEvent.data)}
					/>
				</View>
			);
		} else if (selectedEpisode) {
			return <ActivityIndicator size={50} />;
		} else {
			// pass
		}
	};

	const WatchButton = () => {
		if (selectedQuality) {
			return (
				<View style={styles.buttonStyle}>
					<Button
						title="Watch!"
						onPress={() =>
							navigation.navigate("Watch", { source: selectedQuality })
						}
					/>
				</View>
			);
		} else {
			// pass
		}
	};

	if (data) {
		return (
			<ScrollView>
				<StatusBar style="dark" />
				<Image
					style={styles.imageStyle}
					source={{ uri: content["Image Source"] }}
				/>
				<Text style={styles.titleStyle}>{content["Title"]}</Text>
				<SeasonSelector />
				<EpisodeSelector />
				<QualitySelector />
				<WatchButton />
			</ScrollView>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<StatusBar style="dark" />
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	imageStyle: {
		width: 320,
		height: 480,
		alignSelf: "center",
		margin: 5,
	},
	titleStyle: {
		textAlign: "center",
		fontSize: 20,
		color: "black",
	},
	initValueTextStyle: {
		color: "blue",
	},
	modalSelectorStyle: {
		borderColor: "black",
		borderWidth: 1,
		width: 250,
		alignSelf: "center",
		margin: 10,
		borderRadius: 5,
	},
	buttonStyle: {
		width: 125,
		alignSelf: "center",
		margin: 10,
	},
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
});

export default SelectScreen;
