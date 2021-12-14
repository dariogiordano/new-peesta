import styled from "styled-components";
import { TRACK_COLOR } from "../../../../features/constants";

const StyledIconButton = styled.button`
	display: flex;
	background-color: tomato;
	color: white;
	text-align: center;
	border-style: solid;
	border-width: 1px;
	border-color: tomato;
	border-radius: 50%;
	padding: 4px;
	font-family: "Staatliches", cursive;
	font-size: 1.1em;
	margin: 0 0 10px 0;
	justify-content: center;
	:hover {
		cursor: pointer;
		background-color: white;
		color: tomato;
		.tooltip {
			top: 36px;
			opacity: 1;
		}
	}
	position: relative;
	.tooltip {
		display: block;
		transition-timing-function: ease-out;
		transition: opacity 300ms;
		width: max-content;
		font-size: 12px;
		font-family: sans-serif;
		position: absolute;
		top: -3600px;
		opacity: 0;
		padding: 3px 6px;
		background-color: ${TRACK_COLOR};
		color: white;
		border-radius: 5px;
	}
	&.disabled,
	.disabled:hover {
		background-color: chocolate;
		color: white;
		border-color: chocolate;
		cursor: default;
	}
`;

export default StyledIconButton;
