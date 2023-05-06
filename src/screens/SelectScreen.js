import React, { useState, useEffect } from "react";

import {
	ImageBackground,
	View,
	Dimensions,
	ScrollView,
	Pressable,
	Linking,
	ToastAndroid,
} from "react-native";

import {
	Text,
	useTheme,
	ActivityIndicator,
	IconButton,
	Snackbar,
} from "react-native-paper";

import Icon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import { TMDB_API_KEY } from "@env";
import { WebView } from "react-native-webview";
import Clipboard from "@react-native-clipboard/clipboard";
import { Storage } from "../components/Storage";
import { useIsFocused } from "@react-navigation/native";
import { isTablet } from "react-native-device-info";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { SafeAreaView } from "react-native-safe-area-context";
import ReactNativeBlobUtil from "react-native-blob-util";
import EpisodeCard from "../components/EpisodeCard";
import DefaultSelector from "../components/DefaultSelector";
import ExpandableText from "../components/ExpandableText";
import ActionButtons from "../components/ActionButtons";
import CastList from "../components/CastList";

const getOverview = async (tmdbId, category) => {
	return fetch(
		`https://api.themoviedb.org/3/${
			category == "movies" ? "movie" : "tv"
		}/${tmdbId}?api_key=${TMDB_API_KEY}`,
	)
		.then(response => response.json())
		.then(json => {
			if (json.overview) {
				return json.overview + " (TMDb)";
			} else {
				return "N/A";
			}
		})
		.catch(e => console.error(e));
};

const getCast = async (tmdbId, category) => {
	return fetch(
		`https://api.themoviedb.org/3/${
			category == "movies" ? "movie" : "tv"
		}/${tmdbId}/credits?api_key=${TMDB_API_KEY}`,
	)
		.then(response => response.json())
		.then(json => {
			if (json.cast) {
				return json.cast;
			} else {
				return "N/A";
			}
		})
		.catch(e => console.error(e));
};

const SelectScreen = ({ navigation, route }) => {
	const provider = Storage.getString("provider");
	const common = require("../data/common.json");
	const { id, category } = route.params;
	const theme = useTheme();
	const useProxy = Storage.getBoolean("useProxy");
	const contentWithSeasons = ["series", "tvshows", "asian-series"];
	const watchlist = JSON.parse(Storage.getString("watchlist"));
	const resume = JSON.parse(Storage.getString("resume"));
	const isFocused = useIsFocused();

	const [data, setData] = useState(null);
	const [overview, setOverview] = useState(null);
	const [cast, setCast] = useState(null);
	const [visible, setVisible] = React.useState(false);
	const [webpageUrl, setWebpageUrl] = useState(null);
	const [qualities, setQualities] = useState(null);
	const [type, setType] = useState(null);
	const [episodes, setEpisodes] = useState([]);
	const [seasons, setSeasons] = useState(null);
	const [selectedSeason, setSelectedSeason] = useState(null);
	const [selectedEpisode, setSelectedEpisode] = useState(null);
	const [seasonsSelectorVisible, setSeasonsSelectorVisible] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [snackbarVisible, setSnackbarVisible] = useState(false);
	const orientation = useDeviceOrientation();

	const [showLoading, setShowLoading] = useState(
		category == "movies" ? true : false,
	);

	const [inWatchList, setInWatchList] = useState(
		watchlist.hasOwnProperty(id) ? true : false,
	);

	const jsCode = `
			let qualities = {};
			const buttons = [...document.getElementsByClassName("hd_btn")];

			buttons.forEach((button) => {
				const dataUrl = button.getAttribute("data-url");

				if (dataUrl.includes("master")) {
					qualities["Auto"] = dataUrl;
				} else {
					const dataUrlSplitted = dataUrl.split("_");
					const label = dataUrlSplitted[dataUrlSplitted.length - 2].split("d")[1].replace("b", "p");
					qualities[label] = dataUrl;
				}
			})

			window.ReactNativeWebView.postMessage(JSON.stringify(qualities));
		`;

	useEffect(() => setRefresh(!refresh), [isFocused]);
	useEffect(() => setRefresh(!refresh), [orientation]);

	useEffect(() => {
		if (seasons) {
			setSelectedSeason(Object.entries(seasons)[0]);
		} else {
			// pass
		}
	}, [seasons]);

	const handleQualitySelect = item => {
		setVisible(false);

		switch (type) {
			case "Play":
				navigation.navigate("Watch", {
					source: item[1],
					category: category,
					id: category.includes("movies") ? id : selectedEpisode,
				});
				break;
			case "Copy":
				Clipboard.setString(item[1]);
				ToastAndroid.show("Copied", ToastAndroid.SHORT);
				break;
			case "Open In VLC":
				Linking.openURL(`vlc://${item[1]}`);
				break;
			case "Download":
				Linking.openURL(item[1]);
				break;
			default:
				break;
		}
	};

	const handleSeasonSwitch = item => {
		setSeasonsSelectorVisible(false);
		setSelectedSeason(item);
	};

	useEffect(() => {
		if (data) {
			if (category == "arabic-movies") {
				setShowLoading(true);
				setTimeout(() => setWebpageUrl(data["Source"]), 250);
			} else {
				// pass
			}
		}
	}, [data]);

	useEffect(() => {
		if (category == "movies" && !webpageUrl && data) {
			setTimeout(
				() =>
					setWebpageUrl(
						`https://embed.scdn.to/video_player?uid=0&vid=${data["Source"]}`,
					),
				250,
			);
		} else if (category.includes("arabic") && webpageUrl) {
			fetch(
				useProxy
					? `https://api.codetabs.com/v1/proxy?quest=${webpageUrl}`
					: webpageUrl,
			)
				.then(resp => resp.text())
				.then(text => {
					let HTMLParser = require("fast-html-parser");
					let root = HTMLParser.parse(text);
					const rawSources = root.querySelectorAll("source");
					const sources = {};

					rawSources.forEach(source => {
						sources[source.attributes.size + "p"] = source.attributes.src;
					});

					setQualities(sources);
					setShowLoading(false);
				})
				.catch(e => console.error(e));
		} else if (
			(["anime", "arabic-series"].includes(category) ||
				(contentWithSeasons.includes(category) && selectedSeason)) &&
			data
		) {
			const episodes = [];

			const rawEpisodes = contentWithSeasons.includes(category)
				? data["Seasons"][selectedSeason[1]]["Episodes"]
				: data["Episodes"];

			Object.entries(rawEpisodes).forEach(episode => {
				episodes.push({
					label: `Episode ${episode[1]["Episode Number"]}`,
					key: episode[1]["Source"],
				});
			});
			setEpisodes(episodes);
		} else if (contentWithSeasons.includes(category) && data && !seasons) {
			const seasons = {};
			Object.entries(data["Seasons"]).forEach(season => {
				seasons[`Season ${season[1]["Season Number"]}`] = season[0];
			});
			setSeasons(seasons);
		} else {
			// pass
		}
	}, [data, webpageUrl, selectedSeason]);

	useEffect(() => {
		ReactNativeBlobUtil.fs
			.readFile(
				ReactNativeBlobUtil.fs.dirs.DocumentDir + "/" + category + ".json",
			)
			.then(content => {
				setData(JSON.parse(content)[id]);
			});
	}, []);

	useEffect(() => {
		if (data) {
			getOverview(data["TMDb ID"], category).then(json => setOverview(json));
			getCast(data["TMDb ID"], category).then(json => setCast(json));
		} else {
			// pass
		}
	}, [data]);

	const handleWatchList = () => {
		if (inWatchList) {
			delete watchlist[id];
			setSnackbarVisible(false);
		} else {
			Object.assign(watchlist, {
				[id]: {
					Category: category,
					"Image Source": data["Image Source"],
					Title: data["Title"],
					Rating: data["Rating"] ? data["Rating"] : "N/A",
				},
			});
			setSnackbarVisible(true);
			setTimeout(() => setSnackbarVisible(false), 2500);
		}

		Storage.set("watchlist", JSON.stringify(watchlist));
		setInWatchList(!inWatchList);
	};

	if (overview && cast) {
		return (
			<SafeAreaView style={{ flex: 1 }}>
				<ScrollView scrollEnabled={!showLoading}>
					{qualities && (
						<DefaultSelector
							visible={visible}
							setVisible={setVisible}
							itemList={qualities}
							theme={theme}
							handlePress={handleQualitySelect}
						/>
					)}

					{seasons && (
						<DefaultSelector
							visible={seasonsSelectorVisible}
							setVisible={setSeasonsSelectorVisible}
							itemList={seasons}
							theme={theme}
							handlePress={handleSeasonSwitch}
						/>
					)}

					{isTablet() ||
						(orientation !== "landscape" && (
							<ImageBackground
								source={{ uri: data["Image Source"] }}
								style={{
									width: Dimensions.get("window").width,
									height: Dimensions.get("window").height * 0.4,
								}}>
								<LinearGradient
									colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]}
									start={{ x: 0, y: 1 }}
									end={{ x: 0, y: 0 }}
									style={{ flex: 1 }}>
									<IconButton
										icon="arrow-left"
										size={32}
										onPress={() => navigation.goBack()}
										iconColor={theme.colors.primary}
									/>
								</LinearGradient>
							</ImageBackground>
						))}

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: Dimensions.get("window").width,
						}}>
						<View>
							<Text style={{ fontSize: 26, margin: 10, fontWeight: "bold" }}>
								{data["Title"]}
							</Text>
							<View style={{ flexDirection: "row" }}>
								<Icon
									name="star"
									size={24}
									color={theme.colors.primary}
									style={{ marginHorizontal: 10 }}
								/>
								<Text style={{ fontWeight: "bold" }}>
									{data["Rating"] ? data["Rating"] : "N/A"}
								</Text>
							</View>
						</View>

						<IconButton
							icon={inWatchList ? "bookmark-minus" : "bookmark-minus-outline"}
							size={28}
							onPress={handleWatchList}
							iconColor={theme.colors.primary}
							style={{ margin: 5 }}
						/>
					</View>

					{showLoading && (
						<View style={{ justifyContent: "center", padding: 20 }}>
							<ActivityIndicator size={35} />
						</View>
					)}

					<View>
						<View style={{ flexDirection: "row", margin: 10 }}>
							{qualities ? (
								<ActionButtons
									theme={theme}
									showModal={() => setVisible(true)}
									setType={setType}
									tmdbId={data["TMDb ID"]}
									category={category}
									provider={provider}
								/>
							) : (
								<WebView
									containerStyle={{
										backgroundColor: theme.colors.background,
									}}
									source={{ uri: webpageUrl }}
									injectedJavaScript={jsCode}
									onMessage={event => {
										setShowLoading(false);
										setQualities(JSON.parse(event.nativeEvent.data));
									}}
								/>
							)}
						</View>

						<View style={{ flexDirection: "row", margin: 10 }}>
							<Text>Genres: </Text>
							{data["Genres"].map(genre => (
								<Text key={genre} style={{ marginHorizontal: 7.5 }}>
									{genre}
								</Text>
							))}
						</View>

						<ExpandableText
							text={overview}
							moreTextColor={theme.colors.primary}
						/>

						<CastList castList={cast} />
					</View>

					{selectedSeason && (
						<Pressable
							style={{
								flexDirection: "row-reverse",
								margin: 10,
								alignItems: "center",
							}}
							onPress={() => setSeasonsSelectorVisible(true)}>
							<Text style={{ color: theme.colors.primary, fontSize: 16 }}>
								{selectedSeason[0]}
							</Text>
							<Icon
								name="chevron-down"
								size={16}
								color={theme.colors.primary}
								style={{ paddingHorizontal: 4 }}
							/>
						</Pressable>
					)}

					{episodes.length > 0 && (
						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={false}>
							{episodes.map(({ label, key }) => (
								<EpisodeCard
									label={label}
									posterSource={data["Image Source"]}
									source={key}
									setWebpageUrl={setWebpageUrl}
									key={key}
									selectedEpisode={selectedEpisode}
									setShowLoading={setShowLoading}
									setQualities={setQualities}
									provider={provider}
									theme={theme}
									resume={resume}
									category={category}
									setSelectedEpisode={setSelectedEpisode}
								/>
							))}
						</ScrollView>
					)}
				</ScrollView>
				<Snackbar
					visible={snackbarVisible}
					onDismiss={() => setSeasonsSelectorVisible(false)}
					action={{
						label: "Undo",
						onPress: handleWatchList,
					}}>
					Added to Watchlist
				</Snackbar>
			</SafeAreaView>
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

export default SelectScreen;
