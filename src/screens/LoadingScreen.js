import React from "react";
import * as FileSystem from "expo-file-system";
import RNRestart from "react-native-restart";
import CentredActivityIndicator from "../components/CentredActivityIndicator";
import { Storage } from "../components/Storage";

const LoadingScreen = () => {
	const common = require("../data/common.json");
	let progress = 0;
	const fileUrls =
		Storage.getString("provider") == "fasel"
			? common.fileUrlsFasel
			: common.fileUrlsHdw;

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
