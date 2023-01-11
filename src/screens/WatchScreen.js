import React, { useState, useRef, useEffect } from "react";
import { AppState, View } from "react-native";
import WebView from "react-native-webview";
import PipHandler from "react-native-pip-android";
import { Storage } from "../components/Storage";

const WatchScreen = ({ route, navigation }) => {
	const { source, category, id } = route.params;
	const [viewPadding, setViewPadding] = useState(20);
	const appState = useRef(AppState.currentState);
	const [currentTime, setCurrentTime] = useState(0);

	navigation.addListener("beforeRemove", () => {
		Storage.set(id + category, currentTime);
	});

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
							<video id="player" style="width: 100%; height: 100%; background: #000;" controls>
								<source src=${source}>
							</video>

							<script>
								var player = document.getElementById("player");
								player.addEventListener("timeupdate", () => {
									window.ReactNativeWebView.postMessage(player.currentTime);
									// window.ReactNativeWebView.postMessage(player.duration);
								});
							</script>
						</body>
					</html>`;

	return (
		<View
			style={{ flex: 1, paddingBottom: viewPadding, backgroundColor: "black" }}
		>
			<WebView
				source={{ html: html }}
				onMessage={(event) => setCurrentTime(event.nativeEvent.data)}
			/>
		</View>
	);
};

export default WatchScreen;
