import React, { useState, useCallback } from "react";
import { Pressable } from "react-native";
import { Text } from "react-native-paper";

const ExpandableText = ({ text, moreTextColor }) => {
	const [textShown, setTextShown] = useState(false);
	const [lengthMore, setLengthMore] = useState(false);
	const toggleNumberOfLines = () => {
		setTextShown(!textShown);
	};

	const onTextLayout = useCallback(e => {
		setLengthMore(e.nativeEvent.lines.length > 3);
	}, []);

	if (text !== "N/A") {
		return (
			<Pressable
				onPress={toggleNumberOfLines}
				style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}>
				<Text
					onTextLayout={onTextLayout}
					numberOfLines={textShown ? undefined : 3}
					style={{ lineHeight: 21 }}>
					{text}
				</Text>
				{lengthMore && (
					<Text
						onPress={toggleNumberOfLines}
						style={{ lineHeight: 21, color: moreTextColor }}>
						{textShown ? "View Less" : "View More"}
					</Text>
				)}
			</Pressable>
		);
	} else {
		return;
	}
};

export default ExpandableText;
