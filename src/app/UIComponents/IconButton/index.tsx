import React, { useRef } from "react";
import StyledIconButton from "./styled";

export interface IconButtonProps {
	text: string;
	onButtonClick: Function;
	disabled?: boolean;
	tooltip: string;
}

const Button = (props: IconButtonProps) => {
	const handleClick = () => props.onButtonClick();
	let over = useRef(false);
	return (
		<StyledIconButton onClick={handleClick}>
			<span
				onMouseOver={() => (over.current = true)}
				onMouseOut={() => (over.current = false)}
				className="material-icons"
			>
				{props.text}
			</span>
			<span className={over.current ? "tooltip on" : " tooltip off"}>
				{props.tooltip}
			</span>
		</StyledIconButton>
	);
};
export default Button;
