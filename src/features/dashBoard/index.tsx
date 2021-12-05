import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Button from "../../app/UIComponents/Button";
import {
	changeColor,
	changeSize,
	selectColor,
	selectDataUrl,
	selectSize,
	setExternalDataUrl,
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
	selectTrailPoints,
	setAlertMsg,
	setCurrentLap,
	setGear,
	setIsMoving,
	setTrailPoints,
} from "../grid/gridSlice";

const DashBoard = () => {
	const dispatch = useAppDispatch();
	const brushColor = useAppSelector(selectColor);
	const moves = useAppSelector(selectTrailPoints);
	const brushSize = useAppSelector(selectSize);
	const gameState = useAppSelector(selectGameState);
	const alertMsg = useAppSelector(selectAlertMsg);
	const currentLap = useAppSelector(selectCurrentLap);
	const raceLaps = useAppSelector(selectRaceLaps);
	const gear = useAppSelector(selectGear);
	const dataUrl = useAppSelector(selectDataUrl);
	const startAgain = () => {
		dispatch(changeGameState(GameState.running));
		dispatch(setTrailPoints([]));
		dispatch(setIsMoving(false));
		dispatch(setCurrentLap(1));
		dispatch(setGear(0));
		dispatch(setAlertMsg(""));
	};
	const handleFileChange = (e: any) => {
		let fileData = new FileReader();
		fileData.onloadend = handleFile;
		fileData.readAsDataURL(e);
		e = null;
	};
	const handleFile = (e: any) => {
		dispatch(setExternalDataUrl(e.target.result));
	};

	const saveTrack = () => {
		var link: HTMLAnchorElement = document.createElement("a");
		link.download = "track.png";
		link.href = dataUrl;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

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
						<Button
							text="SAVE THIS TRACK"
							onButtonClick={() => saveTrack()}
						></Button>

						<input
							type="file"
							title="select"
							onClick={(e: any) => (e.target.value = null)}
							onChange={(e: any) => handleFileChange(e.target.files[0])}
						/>
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
					<div>MOVES:{moves.length === 0 ? 0 : moves.length - 1}</div>
					<Button
						text="RESTART RACE"
						onButtonClick={() => startAgain()}
					></Button>
				</div>
			)}
			{gameState === GameState.end && (
				<div>
					<Button
						text="START AGAIN"
						onButtonClick={() => startAgain()}
					></Button>
				</div>
			)}
		</StyledDashBoard>
	);
};
export default DashBoard;
