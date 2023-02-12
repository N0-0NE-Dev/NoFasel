import React from "react";
import * as FileSystem from "expo-file-system";
import RNRestart from "react-native-restart";
import CentredActivityIndicator from "../components/CentredActivityIndicator";

const LoadingScreen = () => {
	const fileUrls = require("../data/common.json").fileUrls;
	let progress = 0;

	fileUrls.forEach((url) => {
		const fileName = url.split("/").slice(-1)[0];
		FileSystem.downloadAsync(url, FileSystem.documentDirectory + fileName).then(
			() => {
				progress++;
				if (progress == fileUrls.length) {
					RNRestart.Restart();
				} else {
					// pass
				}
			}
		);
	});

	return <CentredActivityIndicator />;
};

export default LoadingScreen;
