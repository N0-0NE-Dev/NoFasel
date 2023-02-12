import React, { useState, useEffect, useCallback } from "react";

import {
	ImageBackground,
	View,
	StyleSheet,
	Dimensions,
	Image,
	ScrollView,
	Pressable,
	Linking,
	ToastAndroid,
	FlatList,
	Modal,
} from "react-native";

import {
	Text,
	Button,
	useTheme,
	ActivityIndicator,
	IconButton,
	Snackbar,
} from "react-native-paper";

import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import { TMDB_API_KEY } from "@env";
import { WebView } from "react-native-webview";
import Clipboard from "@react-native-clipboard/clipboard";
import { Storage } from "../components/Storage";
import { useIsFocused } from "@react-navigation/native";
import { isTablet } from "react-native-device-info";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { useDeviceOrientation } from "@react-native-community/hooks";

const getOverview = async (tmdbId, category) => {
	return fetch(
		`https://api.themoviedb.org/3/${
			category == "movies" ? "movie" : "tv"
		}/${tmdbId}?api_key=${TMDB_API_KEY}`
	)
		.then((response) => response.json())
		.then((json) => {
			if (json.overview) {
				return json.overview + " (TMDb)";
			} else {
				return "N/A";
			}
		})
		.catch((e) => console.error(e));
};

const getCast = async (tmdbId, category) => {
	return fetch(
		`https://api.themoviedb.org/3/${
			category == "movies" ? "movie" : "tv"
		}/${tmdbId}/credits?api_key=${TMDB_API_KEY}`
	)
		.then((response) => response.json())
		.then((json) => {
			if (json.cast) {
				return json.cast;
			} else {
				return "N/A";
			}
		})
		.catch((e) => console.error(e));
};

const PostTextContent = ({ text, moreTextColor }) => {
	const [textShown, setTextShown] = useState(false);
	const [lengthMore, setLengthMore] = useState(false);
	const toggleNumberOfLines = () => {
		setTextShown(!textShown);
	};

	const onTextLayout = useCallback((e) => {
		setLengthMore(e.nativeEvent.lines.length > 3);
	}, []);

	if (text !== "N/A") {
		return (
			<Pressable
				onPress={toggleNumberOfLines}
				style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}
			>
				<Text
					onTextLayout={onTextLayout}
					numberOfLines={textShown ? undefined : 3}
					style={{ lineHeight: 21 }}
				>
					{text}
				</Text>
				{lengthMore && (
					<Text
						onPress={toggleNumberOfLines}
						style={{ lineHeight: 21, color: moreTextColor }}
					>
						{textShown ? "View Less" : "View More"}
					</Text>
				)}
			</Pressable>
		);
	} else {
		return;
	}
};

const CastCard = ({ name, role, imageUrl }) => {
	return (
		<View style={{ flexDirection: "row", margin: 10 }}>
			<Image
				source={{ uri: "https://image.tmdb.org/t/p/original" + imageUrl }}
				style={{ width: 70, height: 70, borderRadius: 50 }}
			/>
			<View style={{ justifyContent: "center" }}>
				<Text style={{ marginHorizontal: 5, fontWeight: "bold" }}>{name}</Text>
				<Text style={{ margin: 5, color: "grey" }}>{role}</Text>
			</View>
		</View>
	);
};

const Buttons = ({ showModal, setType, theme, tmdbId, category }) => {
	const defaultBehaviour = (label) => {
		showModal();
		setType(label);
	};

	const buttonsData = [
		{
			mode: "contained",
			icon: "play-circle",
			label: "Play",
			onPress: () => defaultBehaviour("Play"),
		},
		{
			mode: "contained",
			icon: "vlc",
			type: "vlc",
			label: "Open In VLC",
			color: "orange",
			onPress: () => defaultBehaviour("Open In VLC"),
		},
		{
			mode: "contained",
			icon: require("../assets/TMDbLogo.png"),
			label: "TMDb",
			color: "#0d253f",
			labelColor: "white",
			onPress: () =>
				Linking.openURL(
					`https://www.themoviedb.org/${
						category == "movies" ? "movie" : "tv"
					}/${tmdbId}`
				),
		},
		{
			mode: "outlined",
			icon: "tray-arrow-down",
			label: "Download",
			onPress: () => defaultBehaviour("Download"),
			labelColor: theme.colors.primary,
		},
		{
			mode: "outlined",
			icon: "content-copy",
			label: "Copy",
			onPress: () => defaultBehaviour("Copy"),
			labelColor: theme.colors.primary,
		},
	];
	return (
		<FlatList
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			data={buttonsData}
			renderItem={({ item }) => {
				return (
					<Button
						labelStyle={{ color: item.labelColor }}
						mode={item.mode}
						icon={item.icon}
						onPress={item.onPress}
						buttonColor={item.color}
						style={styles.buttonStyle}
					>
						{item.label}
					</Button>
				);
			}}
		/>
	);
};

const CastList = ({ castList }) => {
	if (castList !== "N/A") {
		return (
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
				{castList.slice(0, 10).map((item) => (
					<CastCard
						name={item.name}
						role={item.known_for_department}
						imageUrl={item.profile_path}
						key={item.name + item.known_for_department}
					/>
				))}
			</ScrollView>
		);
	} else {
		return;
	}
};

const QualitySelector = ({
	visible,
	setVisible,
	itemList,
	theme,
	handlePress,
}) => {
	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={visible}
			statusBarTranslucent={true}
		>
			<Pressable
				style={styles.modalBackgroundStyle}
				onPress={() => setVisible(false)}
			>
				<View
					style={{
						...styles.modalViewStyle,
						backgroundColor: theme.colors.background,
					}}
				>
					{Object.entries(itemList).map((item) => (
						<Pressable
							key={item[0]}
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? theme.colors.elevation.level5
										: null,
								},
								{
									flexDirection: "row",
									margin: 10,
									paddingVertical: 10,
									borderRadius: 20,
								},
							]}
							onPress={() => handlePress(item)}
						>
							<Text
								style={{
									fontSize: 16,
									margin: 5,
									flex: 1,
									textAlign: "center",
								}}
							>
								{item[0]}
							</Text>
						</Pressable>
					))}
				</View>
			</Pressable>
		</Modal>
	);
};

const NewSelectScreen = ({ navigation, route }) => {
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
		category == "movies" ? true : false
	);

	const [inWatchList, setInWatchList] = useState(
		watchlist.hasOwnProperty(id) ? true : false
	);

	const jsCode = `
		var qualities = {};
		var buttons = Array.prototype.slice.call(document.querySelector('.downloadLinks.isVip').querySelectorAll('a'));
		buttons.shift();
		buttons.forEach((item) => {
			const label = item.href.split(']')[1].replace('[', '');
			qualities[label] = item.href;
		});
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

	const handleQualitySelect = (item) => {
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

	const handleSeasonSwitch = (item) => {
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
		if (category === "movies" && !webpageUrl) {
			setTimeout(() => setWebpageUrl(`https://www.faselhd.ws/?p=${id}`), 250);
		} else if (category.includes("arabic") && webpageUrl) {
			fetch(
				useProxy
					? `https://api.codetabs.com/v1/proxy?quest=${webpageUrl}`
					: webpageUrl
			)
				.then((resp) => resp.text())
				.then((text) => {
					let HTMLParser = require("fast-html-parser");
					let root = HTMLParser.parse(text);
					const rawSources = root.querySelectorAll("source");
					const sources = {};

					rawSources.forEach((source) => {
						sources[source.attributes.size + "p"] = source.attributes.src;
					});

					setQualities(sources);
					setShowLoading(false);
				})
				.catch((e) => console.error(e));
		} else if (
			(["anime", "arabic-series"].includes(category) ||
				(contentWithSeasons.includes(category) && selectedSeason)) &&
			data
		) {
			const episodes = [];
			const rawEpisodes = contentWithSeasons.includes(category)
				? data["Seasons"][selectedSeason[1]]["Episodes"]
				: data["Episodes"];

			Object.entries(rawEpisodes).forEach((episode) => {
				episodes.push({
					label: `Episode ${episode[1]["Episode Number"]}`,
					key: episode[0],
				});
			});
			setEpisodes(episodes);
		} else if (contentWithSeasons.includes(category) && data && !seasons) {
			const seasons = {};
			Object.entries(data["Seasons"]).forEach((season) => {
				seasons[`Season ${season[1]["Season Number"]}`] = season[0];
			});
			setSeasons(seasons);
		}
	}, [data, webpageUrl, selectedSeason]);

	useEffect(() => {
		FileSystem.readAsStringAsync(
			FileSystem.documentDirectory + category + ".json"
		)
			.then((content) => {
				setData(JSON.parse(content)[id]);
			})
			.catch((e) => console.error(e));
	}, []);

	useEffect(() => {
		if (data) {
			getOverview(data["TMDb ID"], category).then((json) => setOverview(json));
			getCast(data["TMDb ID"], category).then((json) => setCast(json));
		} else {
			// pass
		}
	}, [data]);

	const EpisodeCard = ({ label, posterSource, source }) => {
		return (
			<Pressable
				onPress={() => {
					setSelectedEpisode(source);
					setShowLoading(true);
					setQualities(null);
					if (category == "anime" || contentWithSeasons.includes(category)) {
						setWebpageUrl(`https://www.faselhd.ws/?p=${source}`);
					} else {
						setWebpageUrl(source);
					}
				}}
			>
				<ImageBackground
					source={{ uri: posterSource }}
					style={{ height: 150, width: 150, margin: 5 }}
					imageStyle={{ borderRadius: 15 }}
				>
					<LinearGradient
						colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
						style={{ flex: 1, justifyContent: "flex-end", borderRadius: 15 }}
					>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								flex: 1,
							}}
						>
							<FontAwesome
								name="play-circle"
								size={34}
								color={
									source == selectedEpisode ? theme.colors.primary : "white"
								}
								style={{ marginTop: 20 }}
							/>
						</View>
						<View style={{ justifyContent: "center" }}>
							<Text style={{ margin: 10, fontWeight: "bold" }}>{label}</Text>
						</View>
						{resume.hasOwnProperty(source + category) && (
							<View
								style={{
									height: 10,
									width:
										(Number(resume[source + category]["resume"]) /
											Number(resume[source + category]["duration"])) *
										135,
									backgroundColor: theme.colors.primary,
									borderRadius: 15,
								}}
							/>
						)}
					</LinearGradient>
				</ImageBackground>
			</Pressable>
		);
	};

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
			<View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
				<ScrollView scrollEnabled={!showLoading}>
					{qualities && (
						<QualitySelector
							visible={visible}
							setVisible={setVisible}
							itemList={qualities}
							theme={theme}
							handlePress={handleQualitySelect}
						/>
					)}

					{seasons && (
						<QualitySelector
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
								}}
							>
								<LinearGradient
									colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.5)"]}
									start={{ x: 0, y: 1 }}
									end={{ x: 0, y: 0 }}
									style={{ flex: 1 }}
								>
									<IconButton
										icon="arrow-left"
										size={32}
										onPress={() => navigation.goBack()}
										iconColor={theme.colors.primary}
									/>
								</LinearGradient>
							</ImageBackground>
						))}

					<View style={styles.titleParentStyle}>
						<View>
							<Text style={styles.titleStyle}>{data["Title"]}</Text>
							<View style={{ flexDirection: "row" }}>
								<FontAwesome
									name="star"
									size={24}
									color={theme.colors.primary}
									style={{ marginHorizontal: 10 }}
								/>
								<Text>{data["Rating"] ? data["Rating"] : "N/A"}</Text>
							</View>
						</View>
						<IconButton
							icon={inWatchList ? "bookmark-minus" : "bookmark-minus-outline"}
							size={28}
							onPress={handleWatchList}
							iconColor={theme.colors.primary}
						/>
					</View>

					{showLoading && (
						<View style={{ justifyContent: "center", padding: 20 }}>
							<ActivityIndicator size={35} />
						</View>
					)}

					<View>
						{qualities ? (
							<Buttons
								theme={theme}
								showModal={() => setVisible(true)}
								setType={setType}
								tmdbId={data["TMDb ID"]}
								category={category}
							/>
						) : (
							<WebView
								source={{ uri: webpageUrl }}
								injectedJavaScript={jsCode}
								onMessage={(event) => {
									setQualities(JSON.parse(event.nativeEvent.data));
									setShowLoading(false);
								}}
							/>
						)}

						<PostTextContent
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
							onPress={() => setSeasonsSelectorVisible(true)}
						>
							<Text style={{ color: theme.colors.primary, fontSize: 16 }}>
								{selectedSeason[0]}
							</Text>
							<FontAwesome
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
							showsHorizontalScrollIndicator={false}
						>
							{episodes.map(({ label, key }) => (
								<EpisodeCard
									label={label}
									posterSource={data["Image Source"]}
									source={key}
									setWebpageUrl={setWebpageUrl}
									key={key}
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
					}}
				>
					Added to Watchlist
				</Snackbar>
			</View>
		);
	} else {
		return <CentredActivityIndicator />;
	}
};

const styles = StyleSheet.create({
	buttonStyle: {
		marginVertical: 10,
		marginHorizontal: 5,
	},
	titleStyle: {
		fontSize: 26,
		margin: 10,
		fontWeight: "bold",
	},
	titleParentStyle: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	modalBackgroundStyle: {
		backgroundColor: "rgba(0,0,0,0.5)",
		position: "absolute",
		...StyleSheet.absoluteFillObject,
		justifyContent: "center",
		alignItems: "center",
	},
	modalViewStyle: {
		marginHorizontal: 20,
		borderRadius: 20,
		alignItems: "center",
	},
});

export default NewSelectScreen;
