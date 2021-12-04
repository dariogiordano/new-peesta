import React from "react";
import StyledSvg from "./styled";
interface Props {
	viewBox: string;
}
const SvgBoard: React.FC<Props> = (props) => {
	return (
		<StyledSvg viewBox={props.viewBox}>
			{props.children}
			Sorry, your browser does not support inline SVG.
		</StyledSvg>
	);
};
export default SvgBoard;
