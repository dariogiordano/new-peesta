import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../app/UIComponents/Button";
import {
	changeColor,
	changeSize,
	selectColor,
	selectSize,
} from "../drawBoard/drawBoardSlice";
import { selectGameState } from "./dashBoardSlice";
import StyledDashBoard from "./styled";
import { changeGameState } from "./dashBoardSlice";
import { BG_COLOR, GameState, TRACK_COLOR } from "../constants";
import ColorButton from "../../app/UIComponents/ColorButton";
import Slider from "../../app/UIComponents/Slider";
import {
	selectAlertMsg,
	selectCurrentLap,
	selectGear,
	selectRaceLaps,
} from "../grid/gridSlice";

const DashBoard = () => {
	const dispatch = useAppDispatch();
	const brushColor = useAppSelector(selectColor);
	const brushSize = useAppSelector(selectSize);
	const gameState = useAppSelector(selectGameState);
	const alertMsg = useAppSelector(selectAlertMsg);
	const currentLap = useAppSelector(selectCurrentLap);
	const raceLaps = useAppSelector(selectRaceLaps);
	const gear = useAppSelector(selectGear);

	return (
		<StyledDashBoard cursorSize={brushSize}>
			<div>{alertMsg}</div>
			{gameState === GameState.start ||
				(gameState === GameState.draw && (
					<>
						<Button
							text="DRAW FINISH LINE"
							onButtonClick={() => {
								dispatch(changeGameState(GameState.drawFinishLine));
							}}
						></Button>
						<Button
							text="RESET"
							onButtonClick={() => dispatch(changeGameState(GameState.start))}
						></Button>
						<ColorButton
							onButtonClick={() => dispatch(changeColor(TRACK_COLOR))}
							brushColor={brushColor}
							color={TRACK_COLOR}
						/>
						<ColorButton
							onButtonClick={() => dispatch(changeColor(BG_COLOR))}
							brushColor={brushColor}
							color={BG_COLOR}
						/>
						<Slider
							brushSize={brushSize}
							onChange={(e: number) => dispatch(changeSize(e))}
						></Slider>
					</>
				))}
			{gameState === GameState.drawFinishLine && (
				<Button
					text="START RUNNING"
					onButtonClick={() => dispatch(changeGameState(GameState.running))}
				></Button>
			)}
			{gameState === GameState.running && (
				<div>
					<div>
						LAP:{currentLap}/{raceLaps}
					</div>
					<div>GEAR:{gear}</div>
				</div>
			)}
		</StyledDashBoard>
	);
};
export default DashBoard;
