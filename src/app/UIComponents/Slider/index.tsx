import React from "react";
import StyledSlider from "./styled";
interface sliderProps {
	cursorSize: number;
	onChange: Function;
	min: number;
	max: number;
	default: number;
}
const Slider = (props: sliderProps) => {
	const rangeRef = React.useRef<HTMLInputElement>(null);
	const handleChange = () => {
		if (rangeRef.current) {
			props.onChange(rangeRef.current.value);
		}
	};

	return (
		<StyledSlider size={props.cursorSize / 2}>
			<input
				ref={rangeRef}
				type="range"
				min={props.min}
				max={props.max}
				defaultValue={props.default}
				onInput={() => handleChange()}
				className="slider"
			></input>
		</StyledSlider>
	);
};
export default Slider;
