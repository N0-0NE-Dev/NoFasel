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
} from "react-native";

import {
	Text,
	Button,
	useTheme,
	ActivityIndicator,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";

import * as FileSystem from "expo-file-system";
import { FontAwesome } from "@expo/vector-icons";
import LinearGradient from "react-native-linear-gradient";
import { TMDB_API_KEY } from "@env";
import { WebView } from "react-native-webview";
import Clipboard from "@react-native-clipboard/clipboard";
import { Storage } from "../components/Storage";

const getOverview = async (tmdbId, category) => {
	console.log(tmdbId);
	return fetch(
		`https://api.themoviedb.org/3/${
			category == "movies" ? "movie" : "tv"
		}/${tmdbId}?api_key=${TMDB_API_KEY}`
	)
		.then((response) => response.json())
		.then((json) => {
			if (json.overview) {
				return json.overview;
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
		setLengthMore(e.nativeEvent.lines.length >= 3);
	}, []);

	if (text !== "N/A") {
		return (
			<View style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}>
				<Text
					onTextLayout={onTextLayout}
					numberOfLines={textShown ? undefined : 3}
					style={{ lineHeight: 21 }}
				>
					{text}
				</Text>
				{lengthMore ? (
					<Text
						onPress={toggleNumberOfLines}
						style={{ lineHeight: 21, color: moreTextColor }}
					>
						{textShown ? "View Less" : "View More"}
					</Text>
				) : null}
			</View>
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
			<View>
				<Text style={{ marginHorizontal: 5 }}>{name.replace(" ", "\n")}</Text>
				<Text style={{ margin: 5, color: "grey" }}>{role}</Text>
			</View>
		</View>
	);
};

const Buttons = ({ showModal, setType }) => {
	return (
		<ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
			<Button
				style={styles.buttonStyle}
				mode="contained"
				icon="play-circle"
				onPress={() => {
					showModal();
					setType("play");
				}}
			>
				Play
			</Button>
			<Button
				mode="contained"
				icon="vlc"
				style={styles.buttonStyle}
				buttonColor="orange"
				onPress={() => {
					showModal();
					setType("vlc");
				}}
			>
				Open In VLC
			</Button>
			<Button
				mode="outlined"
				style={styles.buttonStyle}
				icon="tray-arrow-down"
				onPress={() => {
					showModal();
					setType("download");
				}}
			>
				Download
			</Button>
			<Button
				mode="outlined"
				style={styles.buttonStyle}
				icon="content-copy"
				onPress={() => {
					showModal();
					setType("copy");
				}}
			>
				Copy
			</Button>
		</ScrollView>
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
	qualityList,
	navigation,
	category,
	id,
	theme,
	type,
}) => {
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={() => setVisible(false)}
				contentContainerStyle={{ backgroundColor: theme.colors.background }}
				style={{ backgroundColor: theme.colors.backdrop, padding: 50 }}
			>
				{Object.entries(qualityList).map((item) => (
					<Pressable
						key={item[0]}
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? theme.colors.elevation.level5 : null,
							},
							{ flexDirection: "row", margin: 10, paddingVertical: 10 },
						]}
						onPress={() => {
							setVisible(false);

							switch (type) {
								case "play":
									navigation.navigate("Watch", {
										source: item[1],
										category: category,
										id: id,
									});
									break;
								case "copy":
									Clipboard.setString(item[1]);
									ToastAndroid.show("Copied", ToastAndroid.SHORT);
									break;
								case "vlc":
									Linking.openURL(`vlc://${item[1]}`);
									break;
								case "download":
									Linking.openURL(item[1]);
									break;
								default:
									break;
							}
						}}
					>
						<Text style={{ fontSize: 16, margin: 5 }}>{item[0]}</Text>
					</Pressable>
				))}
			</Modal>
		</Portal>
	);
};

const NewSelectScreen = ({ navigation, route }) => {
	const { id, category } = route.params;
	const useProxy = Storage.getBoolean("useProxy");
	const [data, setData] = useState(null);
	const [overview, setOverview] = useState(null);
	const [cast, setCast] = useState(null);
	const [visible, setVisible] = React.useState(false);
	const [webpageUrl, setWebpageUrl] = useState(null);
	const [qualities, setQualities] = useState(null);
	const [type, setType] = useState(null);
	const theme = useTheme();

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

	useEffect(() => {
		if (category === "movies" && !webpageUrl) {
			setWebpageUrl(`https://www.faselhd.club/?p=${id}`);
		} else if (category === "arabic-movies" && data) {
			fetch(
				useProxy
					? `https://api.codetabs.com/v1/proxy?quest=${data["Source"]}`
					: data["Source"]
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
				})
				.catch((e) => console.error(e));
		}
	}, [data]);

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

	if (overview && cast) {
		return (
			<ScrollView style={{ backgroundColor: theme.colors.background, flex: 1 }}>
				{qualities && (
					<QualitySelector
						visible={visible}
						setVisible={setVisible}
						qualityList={qualities}
						category={category}
						id={id}
						navigation={navigation}
						theme={theme}
						type={type}
					/>
				)}

				<ImageBackground
					source={{ uri: data["Image Source"] }}
					style={styles.imageStyle}
				>
					<View>
						<LinearGradient
							colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.25)"]}
							start={{ x: 0, y: 1 }}
							end={{ x: 0, y: 0 }}
						>
							<IconButton
								icon="arrow-left"
								size={32}
								onPress={() => navigation.goBack()}
							/>
						</LinearGradient>
					</View>
				</ImageBackground>

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
					<IconButton icon="bookmark-minus-outline" size={28} />
				</View>

				<View>
					{qualities ? (
						<Buttons showModal={() => setVisible(true)} setType={setType} />
					) : (
						<WebView
							source={{ uri: webpageUrl }}
							injectedJavaScript={jsCode}
							onMessage={(event) =>
								setQualities(JSON.parse(event.nativeEvent.data))
							}
						/>
					)}

					<PostTextContent
						text={overview}
						moreTextColor={theme.colors.primary}
					/>
					<CastList castList={cast} />
				</View>
			</ScrollView>
		);
	} else {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					backgroundColor: theme.colors.background,
				}}
			>
				<ActivityIndicator size={50} />
			</View>
		);
	}
};

const styles = StyleSheet.create({
	imageStyle: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height * 0.4,
	},
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
});

export default NewSelectScreen;
