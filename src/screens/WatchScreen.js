import React, { useState, useRef, useEffect } from "react";
import { AppState, View } from "react-native";
import WebView from "react-native-webview";
import PipHandler from "react-native-pip-android";
import { Storage } from "../components/Storage";

const WatchScreen = ({ route, navigation }) => {
	const { source, category, id } = route.params;
	const [viewPadding, setViewPadding] = useState(20);
	const appState = useRef(AppState.currentState);
	const resume = JSON.parse(Storage.getString("resume"));
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const startTime = resume.hasOwnProperty(id + category)
		? resume[id + category]["resume"]
		: 0;

	navigation.addListener("beforeRemove", () => {
		if (currentTime > 60) {
			Object.assign(resume, {
				[id + category]: { resume: currentTime, duration: duration },
			});
			if (Object.keys(resume).length === 501) {
				delete resume[Object.keys(resume)[0]];
			} else {
				// pass
			}
			Storage.set("resume", JSON.stringify(resume));
		} else {
			// pass
		}
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
							<video id="player" style="width: 100%; height: 100%; background: #000;" controls autoplay>
								<source src="${source}">
							</video>

							<script>
								var player = document.getElementById("player");

								player.addEventListener("loadeddata", () => {
									window.ReactNativeWebView.postMessage("duration: " + String(player.duration));
									player.currentTime = ${startTime}
								}, false)
								
								player.addEventListener("timeupdate", () => {
									window.ReactNativeWebView.postMessage(player.currentTime);
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
				onMessage={(event) => {
					if (event.nativeEvent.data.includes("duration")) {
						setDuration(event.nativeEvent.data.split(" ")[1]);
					} else {
						setCurrentTime(event.nativeEvent.data);
					}
				}}
				mediaPlaybackRequiresUserAction={false}
			/>
		</View>
	);
};

export default WatchScreen;
