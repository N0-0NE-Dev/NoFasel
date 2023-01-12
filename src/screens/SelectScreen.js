import React, { useEffect, useState, useRef } from "react";
import {
	Text,
	Image,
	View,
	StyleSheet,
	ActivityIndicator,
	ScrollView,
	Linking,
	ToastAndroid,
} from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { Storage } from "../components/Storage";
import StyledModalSelector from "../components/StyledModalSelector";
import {
	FontAwesome,
	AntDesign,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Clipboard from "@react-native-clipboard/clipboard";

const darkTheme = Storage.getBoolean("darkTheme");

const SelectScreen = ({ navigation, route }) => {
	const { id, category } = route.params;
	const contentWithSeasons = ["series", "tvshows", "asian-series"];
	const scrollViewRef = useRef(null);
	const jsCode =
		"window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)";

	const useProxy = Storage.getBoolean("useProxy");

	const [data, setData] = useState(null);

	const [faselPageSource, setFaselPageSource] = useState(null);
	const [contentSource, setContentSource] = useState(null);

	const [avilableQualities, setAvilableQualities] = useState(null);
	const [selectedQuality, setSelectedQuality] = useState(null);

	const [seasons, setSeasons] = useState(null);
	const [selectedSeason, setSelectedSeason] = useState(null);

	const [episodes, setEpisodes] = useState(null);
	const [selectedEpisode, setSelectedEpisode] = useState(null);

	const [copied, setCopied] = useState(false);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + category + ".json"
		).then((data) => setData(JSON.parse(data)[id]));
	}, []);

	const getSources = (watchUrl) => {
		if (
			faselPageSource &&
			category != "arabic-series" &&
			category != "arabic-movies"
		) {
			let HTMLParser = require("fast-html-parser");
			let root = HTMLParser.parse(faselPageSource);
			const buttons = root
				.querySelector(".downloadLinks.isVip")
				.querySelectorAll("a");

			if (buttons.length !== 0) {
				let dataUrls = [];
				buttons.forEach((button) => {
					const dataUrl = button.rawAttributes.href;
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
				setAvilableQualities(dataUrls);
			} else {
				// pass
			}
		} else {
			fetch(
				useProxy
					? `https://api.codetabs.com/v1/proxy?quest=${watchUrl}`
					: watchUrl
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
							key: source.attributes.src,
						});
					});

					setAvilableQualities(sources);
				})
				.catch((e) => console.error(e));
		}
	};

	const getSeriesEpisodes = (season) => {
		const episodes = [];
		let toUse = null;

		if (contentWithSeasons.includes(category)) {
			toUse = data["Seasons"][season]["Episodes"];
		} else if (category == "anime" || category == "arabic-series") {
			toUse = data["Episodes"];
		} else {
			// pass
		}

		Object.entries(toUse).forEach((episode) => {
			episodes.push({
				label: `Episode ${episode[1]["Episode Number"]}`,
				key: episode[1]["Source"],
				id: episode[0],
			});
		});

		setEpisodes(episodes);
	};

	const getSeasons = () => {
		const seasons = [];
		Object.entries(data["Seasons"]).forEach((season) =>
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
			setAvilableQualities(null);
			setContentSource(null);
			setSelectedEpisode(null);
			setSelectedQuality(null);
			if (selectedSeason) {
				getSeriesEpisodes(selectedSeason);
			} else if (category == "anime" || category == "arabic-series") {
				getSeriesEpisodes();
			} else {
				// pass
			}
		} else {
			// pass
		}
	}, [selectedSeason, data]);

	useEffect(() => {
		setAvilableQualities(null);
		setSelectedQuality(null);
		if (category == "movies" && data) {
			setTimeout(() => setContentSource(id), 250);
		} else if (selectedEpisode && category != "arabic-series") {
			setContentSource(selectedEpisode.id);
		} else if (selectedEpisode && category == "arabic-series") {
			getSources(selectedEpisode.key);
		} else if (category == "arabic-movies" && data) {
			getSources(data["Source"]);
		} else {
			// pass
		}
	}, [data, selectedEpisode]);

	useEffect(() => {
		if (faselPageSource) {
			getSources();
		} else {
			// pass
		}
	}, [faselPageSource]);

	const SeasonSelector = () => {
		if (contentWithSeasons.includes(category) && seasons) {
			return (
				<StyledModalSelector
					initValue="Select A Season"
					handleChange={(option) => setSelectedSeason(option.key)}
					selectedKey={selectedSeason}
					data={seasons}
				/>
			);
		} else {
			// pass
		}
	};

	const EpisodeSelector = () => {
		if (episodes) {
			return (
				<StyledModalSelector
					initValue="Select An Episode"
					handleChange={(option) => setSelectedEpisode(option)}
					selectedKey={selectedEpisode ? selectedEpisode.key : null}
					data={episodes}
				/>
			);
		} else {
			// pass
		}
	};

	const QualitySelector = () => {
		if (avilableQualities) {
			return (
				<StyledModalSelector
					initValue="Select A Quality"
					handleChange={(option) => setSelectedQuality(option)}
					selectedKey={selectedQuality ? selectedQuality.key : null}
					data={avilableQualities}
				/>
			);
		} else if (contentSource && category != "arabic-series") {
			return (
				<View>
					<ActivityIndicator size={50} />
					<WebView
						source={{
							uri: `https://www.faselhd.club/?p=${contentSource}`,
						}}
						injectedJavaScript={jsCode}
						onMessage={(event) => {
							setFaselPageSource(event.nativeEvent.data);
						}}
					/>
				</View>
			);
		} else if (selectedEpisode || category == "arabic-movies") {
			return <ActivityIndicator size={50} />;
		} else {
			// pass
		}
	};

	const Buttons = () => {
		if (selectedQuality) {
			return (
				<View style={styles.buttonsParentStyle}>
					<AntDesign
						name="download"
						size={32}
						color={darkTheme ? "white" : "black"}
						onPress={() => Linking.openURL(selectedQuality.key)}
						style={styles.buttonStyle}
					/>

					{copied ? (
						<FontAwesome
							name="check"
							size={32}
							color="green"
							style={styles.buttonStyle}
						/>
					) : (
						<MaterialCommunityIcons
							name="content-copy"
							size={32}
							style={styles.buttonStyle}
							onPress={() => {
								Clipboard.setString(selectedQuality.key);
								ToastAndroid.show("Copied", ToastAndroid.SHORT);
								setCopied(true);
								setTimeout(() => setCopied(false), 3000);
							}}
							color={darkTheme ? "white" : "black"}
						/>
					)}

					<MaterialCommunityIcons
						name="vlc"
						size={32}
						color="orange"
						style={styles.buttonStyle}
						onPress={() => Linking.openURL(`vlc://${selectedQuality.key}`)}
					/>

					<FontAwesome
						name="play"
						size={32}
						color={darkTheme ? "white" : "black"}
						onPress={() =>
							navigation.navigate("Watch", {
								source: selectedQuality.key,
								category: category,
								id: category.includes("movies") ? id : selectedEpisode.id,
							})
						}
						style={styles.buttonStyle}
					/>
				</View>
			);
		} else {
			// pass
		}
	};

	if (data) {
		return (
			<ScrollView
				ref={scrollViewRef}
				onContentSizeChange={() => scrollViewRef.current.scrollToEnd()}
			>
				<Image
					style={styles.imageStyle}
					source={{ uri: data["Image Source"] }}
				/>
				<Text selectable={true} style={styles.titleStyle}>
					{data["Title"]}
				</Text>
				<SeasonSelector />
				<EpisodeSelector />
				<QualitySelector />
				<Buttons />
			</ScrollView>
		);
	} else {
		return (
			<View style={styles.indicatorParentStyle}>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	imageStyle: {
		width: 300,
		height: 450,
		alignSelf: "center",
		margin: 10,
	},
	titleStyle: {
		textAlign: "center",
		fontSize: 20,
		color: darkTheme ? "white" : "black",
	},
	initValueTextStyle: {
		color: darkTheme ? "#add8e6" : "blue",
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
		margin: 35,
	},
	indicatorParentStyle: {
		flex: 1,
		justifyContent: "center",
	},
	buttonsParentStyle: {
		flexDirection: "row",
		justifyContent: "center",
	},
});

export default SelectScreen;
