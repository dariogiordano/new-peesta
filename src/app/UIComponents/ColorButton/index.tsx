import React from "react";
import StyledColorButton from "./styled";

interface ColorButtonProps {
	color: string;
	brushColor: string;
	onButtonClick: Function;
	icon: string;
}
const ColorButton = (props: ColorButtonProps) => {
	const handleClick = () => props.onButtonClick();
	const cssClass: string = props.color !== props.brushColor ? "" : "selected";

	return (
		<>
			<StyledColorButton
				className={cssClass}
				color={props.color}
				onClick={handleClick}
			>
				<span className="material-icons">{props.icon}</span>
				<span className="tooltip">{props.icon}</span>
			</StyledColorButton>
		</>
	);
};
export default ColorButton;
