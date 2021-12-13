import styled from "styled-components";
import { CELL_SIZE } from "../../../../features/constants";

const StyledButton = styled.div`
	width: ${CELL_SIZE}px;
	height: ${CELL_SIZE}px;
	border-radius: 50%;
	background-color: ${(props) => props.color};
	margin: 2px;
	display: inline-block;
	border: 3px solid white;
	transition-timing-function: ease-out;
	transition: border 300ms;
	&.selected {
		border: 3px solid tomato;
	}
	&.selected:hover {
		border: 3px solid tomato;
	}
	&:hover {
		cursor: pointer;
		border: 3px solid aqua;
	}
`;

export default StyledButton;
