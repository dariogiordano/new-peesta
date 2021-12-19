import styled from "styled-components";
import { CELL_SIZE, TRACK_COLOR } from "../../../../features/constants";

const StyledButton = styled.div`
	width: ${CELL_SIZE * 1.5}px;
	height: ${CELL_SIZE * 1.5}px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	margin: 2px;
	display: inline-block;
	border: 3px solid white;
	transition-timing-function: ease-out;
	transition: border 300ms;
	.material-icons {
		line-height: ${CELL_SIZE * 1.5}px;
		font-size: 1.2em;
	}
	text-align: center;

	color: white;
	&.selected {
		border: 3px solid tomato;
	}
	&.selected:hover {
		border: 3px solid tomato;
	}
	&:hover {
		z-index: 1;
		cursor: pointer;
		border: 3px solid tomato;
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
`;

export default StyledButton;
