import React from "react";
import StyledIconButton from "./styled";

export interface IconButtonProps {
	text: string;
	onButtonClick: Function;
	disabled?: boolean;
	tooltip: string;
	color?: string;
}

const Button: React.FC<IconButtonProps> = (props: IconButtonProps) => {
	const handleClick = () => props.onButtonClick();

	return (
		<StyledIconButton onClick={handleClick} color={props.color}>
			<span className="material-icons">{props.text}</span>
			<span className="tooltip">{props.tooltip}</span>
		</StyledIconButton>
	);
};
export default Button;
