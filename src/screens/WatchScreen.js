import React from "react";
import WebView from "react-native-webview";
import { View } from "react-native";

const WatchScreen = ({ route }) => {
	const { source } = route.params;

	const html = `<html>
						<head>
							<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
						</head>
						<body style="margin: 0;">
							<video style="width: 100%; height: 100%; background: #000;" controls>
								<source src=${source}>
							</video>
						</body>
					</html>`;

	return (
		<View style={{ flex: 1 }}>
			<WebView style={{ flex: 1 }} source={{ html: html }} />
		</View>
	);
};

export default WatchScreen;
