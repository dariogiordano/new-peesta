import styled from "styled-components";
export interface CursorProps {
	cursorSize: number;
}

const StyledDashBoard = styled.div<CursorProps>`
	user-select: none;
	position: absolute;
	top: 0;
	right: 0;
	width: 220px;
	height: 100%;
	padding: 10px;
	display: flex;
	flex-direction: column;
	.alert-box {
		margin-top: auto;
	}
	padding-bottom: 20px;
	height: calc(100vh - 20px);
`;

export default StyledDashBoard;
