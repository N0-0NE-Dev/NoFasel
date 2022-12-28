import React, { useState, useRef, useEffect } from "react";
import { AppState, View } from "react-native";
import WebView from "react-native-webview";
import PipHandler from "react-native-pip-android";

const WatchScreen = ({ route }) => {
	const { source } = route.params;
	const [viewPadding, setViewPadding] = useState(20);
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		const subscription = AppState.addEventListener("change", (nextAppState) => {
			if (nextAppState == "background") {
				setViewPadding(0);
				PipHandler.enterPipMode();
			} else {
				// pass
			}

			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

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
		<View
			style={{ flex: 1, paddingBottom: viewPadding, backgroundColor: "black" }}
		>
			<WebView source={{ html: html }} />
		</View>
	);
};

export default WatchScreen;
