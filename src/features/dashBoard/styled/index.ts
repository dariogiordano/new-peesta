import styled from "styled-components";
import { BG_COLOR, CELL_SIZE, TRACK_COLOR } from "../../constants";

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

	.flex-box {
		display: flex;
		justify-content: left;
		margin-bottom: 10px;
		padding-bottom: 5px;
		border-bottom: 1px solid #d3d3d3;
		button,
		div {
			margin-right: 5px;
			&.brush-color {
				width: 35%;
			}
			&.brush-size {
				width: calc(65% - 10px);
				margin-left: 10px;
			}
		}
	}
	h1 {
		padding: 0;
		margin: ${CELL_SIZE}px 0 0 0;
		font-size: 4em;
		line-height: 0.8em;
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
		margin: 0;
		font-size: 0.83em;
		color: ${TRACK_COLOR};
		&.subtitle {
			margin-bottom: 15px;
			padding-bottom: 5px;
			border-bottom: 1px solid #d3d3d3;
		}
		&.next-steps {
			text-align: right;
			padding: 0 5px 5px;
			color: #999999;
		}
		&.race-url {
			user-select: text;
			margin-bottom: 10px;
			padding-bottom: 5px;
			border-bottom: 1px solid #d3d3d3;
			word-break: break-all;
		}
	}
`;

export default StyledDashBoard;
