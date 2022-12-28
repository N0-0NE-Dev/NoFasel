import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Linking,
	ActivityIndicator,
	StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import { Storage } from "../components/Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const DownloadScreen = ({ route, navigation }) => {
	const { category, downloadLink, premiumDownload, id, selectedQuality } =
		route.params;
	const [pageSource, setPageSource] = useState(null);
	const [correctUrl, setCorrectUrl] = useState(null);
	const jsCode =
		"window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)";

	if (correctUrl) {
		Linking.openURL(correctUrl).then(() => navigation.goBack());
	} else {
		// pass
	}

	if (category.includes("arabic")) {
		Linking.openURL(downloadLink.replaceAll('"', " ")).then(() =>
			navigation.goBack()
		);
	} else {
		// pass
	}

	useEffect(() => {
		if (pageSource) {
			let HTMLParser = require("fast-html-parser");
			let root = HTMLParser.parse(pageSource);

			if (premiumDownload === true) {
				const downloadButtons = root
					.querySelector(".downloadLinks.isVip")
					.querySelectorAll("a");
				downloadButtons.forEach((button) => {
					const downloadLink = button.rawAttributes.href;
					const currentQuality = downloadLink.split("/").slice(-2, -1)[0];
					console.log(currentQuality.includes("1_original"));

					if (currentQuality.includes(selectedQuality.replace("p", ""))) {
						setCorrectUrl(downloadLink);
					} else if (
						(selectedQuality == "Highest Quality" &&
							currentQuality.includes("1_original")) ||
						selectedQuality == "Auto"
					) {
						setCorrectUrl(downloadLink);
					} else {
						// pass
					}
				});
			} else if (premiumDownload === false) {
				let link = null;

				try {
					link =
						root.querySelectorAll(".dl-link")[0].childNodes[0].rawAttributes
							.href;

					Linking.openURL(link).then(() => navigation.goBack());
				} catch (e) {
					// pass
				}
			}
		}
	}, [pageSource]);

	const PremiumDownloadWebView = () => {
		if (premiumDownload === true && !pageSource) {
			return (
				<View>
					<WebView
						source={{ uri: `https://www.faselhd.club/?p=${id}` }}
						injectedJavaScript={jsCode}
						onMessage={(event) => setPageSource(event.nativeEvent.data)}
					/>
				</View>
			);
		} else if (premiumDownload === false && !pageSource) {
			return (
				<WebView
					source={{
						uri:
							"https://www.t7meel.site/file/" +
							selectedQuality.split("=")[2].replace("&img", ""),
					}}
					injectedJavaScript={jsCode}
				/>
			);
		}
	};

	return (
		<View style={styles.parentStyle}>
			<ActivityIndicator size={50} style={styles.indicatorStyle} />
			<Text style={styles.textStyle}>
				Please wait a link will open in your browser shortly...
			</Text>
			{!category.includes("arabic") && <PremiumDownloadWebView />}
		</View>
	);
};

const styles = StyleSheet.create({
	parentStyle: {
		flex: 1,
		justifyContent: "center",
	},
	indicatorStyle: {
		margin: 25,
	},
	textStyle: {
		textAlign: "center",
		color: darkTheme ? "white" : "black",
	},
});

export default DownloadScreen;
