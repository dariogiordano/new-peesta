import React from "react";
import { CELL_SIZE } from "../../../features/constants";
import StyledSlider from "./styled";
interface sliderProps {
	brushSize: number;
	onChange: Function;
}
const Slider = (props: sliderProps) => {
	const rangeRef = React.useRef<HTMLInputElement>(null);
	const handleChange = () => {
		if (
			rangeRef.current &&
			Math.round(parseInt(rangeRef.current.value)) %
				Math.round(CELL_SIZE / 2) ===
				0
		) {
			props.onChange(rangeRef.current.value);
		}
	};

	return (
		<StyledSlider size={props.brushSize / 2}>
			<input
				ref={rangeRef}
				type="range"
				min={CELL_SIZE * 2}
				max={CELL_SIZE * 4}
				defaultValue={props.brushSize}
				onInput={() => handleChange()}
				className="slider"
			></input>
		</StyledSlider>
	);
};
export default Slider;
