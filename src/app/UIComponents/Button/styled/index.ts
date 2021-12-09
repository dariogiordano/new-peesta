import styled from "styled-components";

const StyledButton = styled.button`
	display: flex;
	background-color: tomato;
	color: white;
	text-align: center;
	border-style: solid;
	border-width: 1px;
	border-color: tomato;
	border-radius: 10px;
	padding: 10px;
	font-weight: bold;
	margin: 0 0 15px 0;
	justify-content: center;
	:hover {
		cursor: pointer;
		background-color: white;
		color: tomato;
	}
	&.disabled,
	.disabled:hover {
		background-color: chocolate;
		color: white;
		border-color: chocolate;
		cursor: default;
	}
`;

export default StyledButton;
