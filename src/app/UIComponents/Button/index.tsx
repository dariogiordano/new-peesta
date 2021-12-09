import React from "react";
import StyledButton from "./styled";

export interface ButtonProps {
	text: string;
	onButtonClick: Function;
	disabled?: boolean;
}

const Button = (props: ButtonProps) => {
	const handleClick = () => props.onButtonClick();
	return <StyledButton onClick={handleClick}>{props.text}</StyledButton>;
};
export default Button;
