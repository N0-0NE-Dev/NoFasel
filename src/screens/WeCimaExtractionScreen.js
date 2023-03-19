import React, { useState } from "react";
import { Linking, View } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import WebView from "react-native-webview";

const WeCimaExtractionScreen = ({ route }) => {
	const { id } = route.params;
	const [qualities, setQualities] = useState(null);

	const jsCode = `
					const qualities = {};

					const items = [...document.getElementsByClassName("Season--Download--Wecima--Single")[0].querySelectorAll("a")];

					items.forEach((item) => {
						const link = item.getAttribute("href");
						const resolution = item.querySelector("resolution").innerText;
						qualities[resolution] = link;
					});

					window.ReactNativeWebView.postMessage(JSON.stringify(qualities));

					`;

	if (!qualities) {
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				<ActivityIndicator size={50} />
				<View>
					<WebView
						source={{ uri: `https://wecima.tube/series/${id}` }}
						injectedJavaScript={jsCode}
						onMessage={event =>
							setQualities(JSON.parse(event.nativeEvent.data))
						}
					/>
				</View>
			</View>
		);
	} else {
		return (
			<View style={{ flex: 1, justifyContent: "center" }}>
				{Object.entries(qualities).map(quality => {
					return (
						<Button
							mode="outlined"
							style={{ marginTop: 10, borderWidth: 0 }}
							labelStyle={{ fontSize: 18, padding: 10 }}
							onPress={() => Linking.openURL(quality[1])}>
							{quality[0]}
						</Button>
					);
				})}
			</View>
		);
	}
};

export default WeCimaExtractionScreen;
