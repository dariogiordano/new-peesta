import styled from "styled-components";
import { Dimensions } from "../../types";

interface GridProps {
	dimensions: Dimensions;
	bg?: string;
}
const StyledGrid = styled.div<GridProps>`
	position: relative;
	width: ${(props) => props.dimensions.w}px;
	height: ${(props) => props.dimensions.h}px;
	background-image: url(${(props) => props.bg || ""});
`;

export default StyledGrid;
