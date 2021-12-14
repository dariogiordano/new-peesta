import React, { useState } from "react";

import Button from "../../UIComponents/Button";
interface IProps {
	textToCopy: string;
}
const CopyToClipboard = (props: IProps) => {
	const [copied, setCopied] = useState(false);

	const handleChange: Function = () => {
		/* Copy the text inside the text field */
		navigator.clipboard.writeText(props.textToCopy).then(() => {
			setCopied(true);
		});
	};

	return (
		<Button
			onButtonClick={() => handleChange()}
			text={copied ? "COPIED! SEND IT TO YOUR OPPONENT" : "CLICK TO COPY LINK"}
		/>
	);
};
export default CopyToClipboard;
