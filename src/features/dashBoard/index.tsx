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
	CELL_SIZE,
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
	setRaceLaps,
	resetInitialStateKeepingTrack,
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
import IconButton from "../../app/UIComponents/IconButton";

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
		dispatch(resetInitialStateKeepingTrack());
		dispatch(changeGameState(GameState.draw));
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
		link.href = dataUrl || "";
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
			<p className="subtitle">
				Draw a track, send it to your opponent and start racing!
			</p>
			{gameState === GameState.start ||
				(gameState === GameState.draw && (
					<>
						<div className="flex-box">
							<div className="brush-color">
								<p>Brush Color</p>
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
							<div className="brush-size">
								<p>Brush Size</p>
								<Slider
									min={CELL_SIZE * 2}
									max={CELL_SIZE * 4}
									cursorSize={brushSize}
									default={brushSize}
									onChange={(e: number) => {
										if (Math.round(e) % Math.round(CELL_SIZE / 2) === 0)
											dispatch(changeSize(e));
									}}
								></Slider>
							</div>
						</div>
						<div className="flex-box">
							<IconButton
								tooltip="Reset drawing"
								text="refresh"
								onButtonClick={() => dispatch(changeGameState(GameState.start))}
							></IconButton>
							<IconButton
								tooltip="Save this track"
								text="file_download"
								onButtonClick={() => saveTrack()}
							></IconButton>
							<IconButton
								tooltip="Upload a saved track"
								text="file_upload"
								onButtonClick={() => loadTrack()}
							></IconButton>
							<input
								ref={fileRef}
								className="invisible-input"
								type="file"
								title="select"
								onClick={(e: any) => (e.target.value = null)}
								onChange={(e: any) => handleFileChange(e.target.files[0])}
							/>
						</div>

						<p className="next-steps">Next steps</p>
						<Button
							text="DRAW START LANE"
							onButtonClick={() =>
								dispatch(changeGameState(GameState.drawFinishLine))
							}
						></Button>
					</>
				))}
			{gameState === GameState.drawFinishLine && (
				<>
					<div className="flex-box">
						<div>
							<p>
								Set number of laps. Now it's <strong>{raceLaps}</strong>
							</p>
							<Slider
								min={1}
								max={5}
								cursorSize={CELL_SIZE * 2}
								default={raceLaps}
								onChange={(e: number) => dispatch(setRaceLaps(e))}
							></Slider>
						</div>
					</div>
					<div className="flex-box">
						<IconButton
							text="edit"
							tooltip="Back to drawing"
							onButtonClick={() => backToDraw()}
						></IconButton>
					</div>
					<p className="next-steps">Next steps</p>
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

			{(gameState === GameState.raceStart ||
				gameState === GameState.trainingStart) && (
				<div className="flex-box">
					<p className="no-select">
						LAP:{myTrailData.currentLap}/{raceLaps}
						<br />
						GEAR:{myTrailData.gear}
						<br />
						MOVES:{myTrailData.movesNumber}
					</p>
				</div>
			)}
			{gameState === GameState.trainingEnd && (
				<div className="flex-box">
					<p className="no-select">
						LAP: -
						<br />
						GEAR: -
						<br />
						MOVES: -
					</p>
				</div>
			)}

			{gameState === GameState.raceStart && (
				<>
					{raceState === RaceState.waitingOpponentStart && (
						<>
							<p className="race-url">
								{`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
							</p>
							<p className="next-steps">Next steps</p>
							<CopyToClipboard
								textToCopy={`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
							/>
						</>
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
							<p className="next-steps">Next steps</p>
							<Button
								text="ASK FOR A NEW ROUND"
								onButtonClick={() => otherRound()}
							></Button>
							<Button
								text="LEAVE THIS RACE"
								onButtonClick={() => backToDrawFromRacing()}
							></Button>
						</>
					)}
				</>
			)}

			{(gameState === GameState.trainingEnd ||
				gameState === GameState.trainingStart) && (
				<>
					<div className="flex-box">
						<IconButton
							text="refresh"
							tooltip="Restart Training"
							onButtonClick={() => startAgain()}
						></IconButton>
						<IconButton
							text="edit"
							tooltip="Back to drawing"
							onButtonClick={() => backToDraw()}
						></IconButton>
					</div>

					<p className="next-steps">Next steps</p>
					<Button
						text="START THE RACE!"
						onButtonClick={() => startRace()}
					></Button>
				</>
			)}

			<h3 className={alertMsg ? "alert-box" : ""}>{alertMsg}</h3>
		</StyledDashBoard>
	);
};
export default DashBoard;
