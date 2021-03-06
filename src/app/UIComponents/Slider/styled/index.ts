import styled from "styled-components";
interface propsSlider {
	size: number;
}

const StyledSlider = styled.div<propsSlider>`
	width: 100%;
	min-height: 30px;

	.slider {
		-webkit-appearance: none;
		width: 100%;
		height: 1px;
		background: #d3d3d3;
		outline: none;
		margin: 0;
	}

	.slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: ${(props) => props.size}px;
		height: ${(props) => props.size}px;
		border-radius: 50%;
		background: #999999;
		cursor: pointer;
	}

	.slider::-moz-range-thumb {
		width: ${(props) => props.size}px;
		height: ${(props) => props.size}px;
		border-radius: 50%;
		background: #999999;
		cursor: pointer;
	}
`;

export default StyledSlider;
