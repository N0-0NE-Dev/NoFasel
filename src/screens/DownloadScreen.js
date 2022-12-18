import React, { useState, useEffect } from "react";
import {
	View,
	Linking,
	ActivityIndicator,
	Text,
	StyleSheet,
} from "react-native";
import WebView from "react-native-webview";
import { Storage } from "../components/Storage";

const darkTheme = Storage.getBoolean("darkTheme");

const DownloadScreen = ({ navigation, route }) => {
	const { category, downloadLink } = route.params;
	const [pageSource, setPageSource] = useState(null);
	const jsCode =
		"window.ReactNativeWebView.postMessage(document.documentElement.innerHTML)";

	console.log(downloadLink)

	useEffect(() => {
		if (pageSource) {
			const HTMLParser = require("fast-html-parser");
			const root = HTMLParser.parse(pageSource);
			let link = null;

			try {
				link =
					root.querySelectorAll(".dl-link")[0].childNodes[0].rawAttributes.href;

				Linking.openURL(link).then(() => navigation.goBack());
			} catch (e) {
				// pass
			}
		} else {
			// pass
		}
	}, [pageSource]);

	if (category == "arabic-series" | category == "arabic-movies") {
		Linking.openURL(downloadLink.replaceAll('"', "")).then(navigation.goBack());
	} else {
		return (
			<View style={styles.parentStyle}>
				<ActivityIndicator size={50} style={styles.indicatorStyle} />
				<Text style={styles.textStyle}>
					Please wait a link will open in your browser shortly.
				</Text>
				<View>
					<WebView
						source={{ uri: downloadLink }}
						injectedJavaScript={jsCode}
						onMessage={(event) => setPageSource(event.nativeEvent.data)}
					/>
				</View>
			</View>
		);
	}
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
