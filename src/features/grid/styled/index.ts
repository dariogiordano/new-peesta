import styled from "styled-components";
import { Dimensions } from "../../types";

interface GridProps {
	dimensions: Dimensions;
	bg: string | null;
}
const StyledGrid = styled.div<GridProps>`
	position: relative;
	width: ${(props) => props.dimensions.w}px;
	height: ${(props) => props.dimensions.h}px;
	background-image: url(${(props) => props.bg || ""});
	background-position: top;
	background-repeat: no-repeat; /* Do not repeat the image */
	background-size: contain; /* Resize the background image to cover the entire container */
`;

export default StyledGrid;
