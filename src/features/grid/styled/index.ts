import styled from "styled-components";
import { Dimensions } from "../../types";

interface GridProps {
	dimensions: Dimensions;
	bg: string | null;
}
const StyledGrid = styled.div<GridProps>`
	position: relative;
	display: flex;
	width: 80%;
	//background-image: url(${(props) => props.bg || ""});
	background-position: top left;
	background-repeat: no-repeat; /* Do not repeat the image */
	overflow: auto;
	img {
		position: absolute;
	}
`;

export default StyledGrid;
