import React, { useRef } from "react";
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
import {
	BG_COLOR,
	GameState,
	RaceEndState,
	RaceState,
	TRACK_COLOR,
} from "../constants";
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
	selectStartLane,
	setPlayerType,
	resetForNewRound,
} from "../grid/gridSlice";
import { useNavigate } from "react-router";

import CopyToClipboard from "../../app/UIComponents/CopyToClipboard";
import {
	selectMyPlayerId,
	selectRaceEndState,
	selectRaceState,
	selectRoomName,
	setOpponentId,
	setRaceEndState,
	setRaceState,
	setRoomName,
} from "../socketClient/socketClientSlice";
import { socket } from "../socketClient";
import { PlayerType } from "../types";

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
	const raceEndState = useAppSelector(selectRaceEndState);
	const startLane = useAppSelector(selectStartLane);
	const fileRef = useRef<HTMLInputElement>(null);

	const otherRound = () => {
		dispatch(setRaceState(RaceState.waitingOpponentMove));
		dispatch(setRaceEndState(RaceEndState.racing));
		dispatch(resetForNewRound());
		dispatch(changeGameState(GameState.raceStart));
		dispatch(setPlayerType(PlayerType.opponent));
		socket.emit("newRound");
	};
	const startRace = () => {
		if (startLane && startLane.points && startLane.points.length > 0) {
			dispatch(setAlertMsg(""));
			dispatch(setMyTrailData(initialMyTrailData));
			dispatch(changeGameState(GameState.raceStart));
		} else {
			dispatch(setAlertMsg("Please add a start lane."));
		}
	};

	const startTraining = () => {
		if (startLane && startLane.points && startLane.points.length > 0) {
			dispatch(changeGameState(GameState.trainingStart));
			dispatch(setAlertMsg(""));
		} else {
			dispatch(setAlertMsg("Please add a start lane."));
		}
	};

	const backToDrawFromRacing = () => {
		socket.close();
		dispatch(setRoomName(null));
		dispatch(setOpponentId(null));
		dispatch(changeGameState(GameState.start));
		dispatch(resetInitialState());
		dispatch(setRaceState(RaceState.start));
		dispatch(setRaceEndState(RaceEndState.racing));
		navigate("/draw");
		dispatch(setAlertMsg(""));
		socket.open();
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
	const loadTrack = () => {
		if (fileRef.current) fileRef.current.click();
	};

	return (
		<StyledDashBoard>
			<h1>PEESTAAH!</h1>
			<p>Draw a track, send it to your opponent and start racing!</p>
			{gameState === GameState.start ||
				(gameState === GameState.draw && (
					<>
						<Button
							text="DRAW START LANE"
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
						<Button
							text="LOAD A SAVED TRACK"
							onButtonClick={() => loadTrack()}
						></Button>

						<input
							ref={fileRef}
							className="invisible-input"
							type="file"
							title="select"
							onClick={(e: any) => (e.target.value = null)}
							onChange={(e: any) => handleFileChange(e.target.files[0])}
						/>
						<h6>Brush Color</h6>
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
						<h6>Brush Size</h6>
						<Slider
							brushSize={brushSize}
							onChange={(e: number) => dispatch(changeSize(e))}
						></Slider>
					</>
				))}
			{gameState === GameState.drawFinishLine && (
				<>
					<Button
						text="DO SOME TRAINING"
						onButtonClick={() => startTraining()}
					></Button>
					<Button
						text="START THE RACE!"
						onButtonClick={() => startRace()}
					></Button>
				</>
			)}

			{gameState === GameState.raceStart && (
				<>
					{raceState === RaceState.waitingOpponentStart && (
						<CopyToClipboard
							textToCopy={`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
						/>
					)}

					{raceState === RaceState.moving && (
						<h5 className="no-select"> Make your move!</h5>
					)}
					{raceState === RaceState.waitingOpponentMove && (
						<h5 className="no-select"> Wait for your opponent's move...</h5>
					)}
					{raceState === RaceState.lastChanceToDraw && (
						<h5 className="no-select">Your last chance to draw...</h5>
					)}
				</>
			)}
			{gameState === GameState.raceEnd && (
				<>
					{raceEndState === RaceEndState.waitingOpponentFinish && (
						<>
							<h5>Good job!</h5>
							<p> Wait for your opponent's last chance to draw...</p>
						</>
					)}
					{raceEndState === RaceEndState.won && <h5> YOU WON!</h5>}
					{raceEndState === RaceEndState.lost && <h5> YOU LOST!</h5>}
					{raceEndState === RaceEndState.draw && <h5> IT'S A DRAW!</h5>}
					{(raceEndState === RaceEndState.won ||
						raceEndState === RaceEndState.lost ||
						raceEndState === RaceEndState.draw) && (
						<>
							<Button
								text="ASK FOR A NEW ROUND"
								onButtonClick={() => otherRound()}
							></Button>
							<Button
								text="DRAW ANOTHER TRACK"
								onButtonClick={() => backToDrawFromRacing()}
							></Button>
						</>
					)}
				</>
			)}
			{(gameState === GameState.trainingEnd ||
				gameState === GameState.trainingStart) && (
				<>
					<Button
						text="RESTART TRAINING"
						onButtonClick={() => startAgain()}
					></Button>
					<Button
						text="START THE RACE!"
						onButtonClick={() => startRace()}
					></Button>
					<Button
						text="DRAW ANOTHER TRACK"
						onButtonClick={() => backToDraw()}
					></Button>
				</>
			)}

			{(gameState === GameState.raceStart ||
				gameState === GameState.trainingStart) && (
				<p className="no-select">
					LAP:{myTrailData.currentLap}/{raceLaps}
					<br />
					GEAR:{myTrailData.gear}
					<br />
					MOVES:{myTrailData.movesNumber}
				</p>
			)}

			<h3 className={alertMsg ? "alert-box" : ""}>{alertMsg}</h3>
		</StyledDashBoard>
	);
};
export default DashBoard;
