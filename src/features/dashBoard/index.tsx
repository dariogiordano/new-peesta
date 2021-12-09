import React, { useEffect } from "react";
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
import { BG_COLOR, GameState, RaceState, TRACK_COLOR } from "../constants";
import ColorButton from "../../app/UIComponents/ColorButton";
import Slider from "../../app/UIComponents/Slider";
import {
	selectAlertMsg,
	selectRaceLaps,
	setAlertMsg,
	resetInitialState,
	setMyTrailData,
	initialMyTrailData,
	selectMyTrailData,
} from "../grid/gridSlice";
import { useNavigate } from "react-router";

import CopyToClipboard from "../../app/UIComponents/CopyToClipboard";
import {
	selectMyPlayerId,
	selectRaceState,
	selectRoomName,
} from "../socketClient/socketClientSlice";

const DashBoard = () => {
	const dispatch = useAppDispatch();
	const brushColor = useAppSelector(selectColor);
	const myTrailData = useAppSelector(selectMyTrailData);
	const brushSize = useAppSelector(selectSize);
	const gameState = useAppSelector(selectGameState);
	const alertMsg = useAppSelector(selectAlertMsg);
	const raceLaps = useAppSelector(selectRaceLaps);
	const dataUrl = useAppSelector(selectDataUrl);
	const navigate = useNavigate();
	const roomName = useAppSelector(selectRoomName);
	const myId = useAppSelector(selectMyPlayerId);
	const raceState = useAppSelector(selectRaceState);

	useEffect(() => {
		if (myTrailData.currentLap === raceLaps + 1) {
			endRace();
			dispatch(changeGameState(GameState.trainingEnd));
		}
	}, [dispatch, myTrailData.currentLap, raceLaps]);

	const startRace = () => {
		dispatch(changeGameState(GameState.raceStart));
		//TODO: socket logic
	};
	const endRace = () => {
		//TODO: socket logic
	};

	const backToDraw = () => {
		dispatch(resetInitialState());
		dispatch(changeGameState(GameState.start));
		navigate("/draw");
	};
	const startAgain = () => {
		dispatch(changeGameState(GameState.trainingStart));
		dispatch(setMyTrailData(initialMyTrailData));
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
			{gameState === GameState.start ||
				(gameState === GameState.draw && (
					<>
						<Button
							text="DRAW FINISH LINE"
							onButtonClick={() =>
								dispatch(changeGameState(GameState.drawFinishLine))
							}
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
						<div>
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
						</div>
						<Slider
							brushSize={brushSize}
							onChange={(e: number) => dispatch(changeSize(e))}
						></Slider>
					</>
				))}
			{gameState === GameState.drawFinishLine && (
				<>
					<Button
						text="DO YOUR TRAINING"
						onButtonClick={() =>
							dispatch(changeGameState(GameState.trainingStart))
						}
					></Button>
					<Button text="START RACE!" onButtonClick={() => startRace()}></Button>
				</>
			)}
			{gameState === GameState.raceStart && (
				<>
					{raceState === RaceState.waitingOpponentStart && (
						<CopyToClipboard
							textToCopy={`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
						/>
					)}
					{(raceState === RaceState.moving ||
						raceState === RaceState.waitingOpponentMove) && (
						<div className="no-select">
							<div>
								LAP:{myTrailData.currentLap}/{raceLaps}
							</div>
							<div>GEAR:{myTrailData.gear}</div>
							<div>MOVES:{myTrailData.movesNumber}</div>
						</div>
					)}
				</>
			)}
			{gameState === GameState.trainingStart && (
				<>
					<Button
						text="RESTART TRAINING"
						onButtonClick={() => startAgain()}
					></Button>
					<Button text="START RACE!" onButtonClick={() => startRace()}></Button>
					<Button
						text="DRAW ANOTHER TRACK"
						onButtonClick={() => backToDraw()}
					></Button>
					<div className="no-select">
						<div>
							LAP:{myTrailData.currentLap}/{raceLaps}
						</div>
						<div>GEAR:{myTrailData.gear}</div>
						<div>MOVES:{myTrailData.movesNumber}</div>
					</div>
				</>
			)}
			{gameState === GameState.trainingEnd && (
				<>
					<Button
						text="START AGAIN"
						onButtonClick={() => startAgain()}
					></Button>
					<Button
						text="DRAW ANOTHER TRACK"
						onButtonClick={() => backToDraw()}
					></Button>
				</>
			)}
			<div className="alert-box">{alertMsg}</div>
		</StyledDashBoard>
	);
};
export default DashBoard;
