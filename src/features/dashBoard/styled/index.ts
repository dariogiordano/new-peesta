import styled from "styled-components";
import { BG_COLOR, TRACK_COLOR } from "../../constants";

const StyledDashBoard = styled.div`
	user-select: none;
	width: 20%;
	padding: 10px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.invisible-input {
		display: none;
	}
	h1 {
		padding: 0;
		margin: 0;
		font-size: 4em;
		color: ${BG_COLOR};
		font-family: "Staatliches", cursive;
	}
	h3.alert-box {
		padding: 0;
		margin: auto 0 0 0;
		font-size: 1em;
		color: tomato;
		border: 1px solid tomato;
		padding: 10px 20px;
	}
	h5 {
		margin: 0 0 16px 0;
		font-size: 1.1em;
		color: ${TRACK_COLOR};
	}
	h6 {
		margin: 10px 0 0 0;
		font-weight: normal;
		font-size: 1em;
		color: ${TRACK_COLOR};
	}
	p {
		padding: 0;
		margin: 0 0 20px 0;
		font-size: 0.83em;
		color: ${TRACK_COLOR};
	}
`;

export default StyledDashBoard;
