import styled from "styled-components";
export interface CursorProps {
	cursorSize: number;
}

const StyledDashBoard = styled.div<CursorProps>`
	position: absolute;
	top: 0;
	right: 0;
	width: 240px;
	height: 100%;
`;

export default StyledDashBoard;
