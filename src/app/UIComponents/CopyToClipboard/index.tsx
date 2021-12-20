import React, { useState } from "react";

import Button from "../../UIComponents/Button";
import StyledCopyToClipboard from "./styled";
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
		<StyledCopyToClipboard>
			<Button
				onButtonClick={() => handleChange()}
				text={copied ? "COPIED!*" : "CLICK TO COPY LINK"}
			/>
			{copied && <span>*You can paste it now.</span>}
		</StyledCopyToClipboard>
	);
};
export default CopyToClipboard;
