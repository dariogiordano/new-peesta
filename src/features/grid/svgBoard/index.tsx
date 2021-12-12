import React from "react";
import { Dimensions } from "../../types";
import StyledSvg from "./styled";
interface Props {
	viewBox: string;
	onSvgClick: Function;
	onSvgMouseMove: Function;
	dimensions: Dimensions;
}
const SvgBoard: React.FC<Props> = (props) => {
	return (
		<StyledSvg
			onClick={(e) => props.onSvgClick(e)}
			onMouseMove={(e) => props.onSvgMouseMove(e)}
			viewBox={props.viewBox}
			width={props.dimensions.w}
			height={props.dimensions.h}
		>
			{props.children}
			Sorry, your browser does not support inline SVG.
		</StyledSvg>
	);
};
export default SvgBoard;
