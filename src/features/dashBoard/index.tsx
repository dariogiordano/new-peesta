import React, { useRef, useState } from "react";
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
import ReactModal from "react-modal";

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
	const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

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

	const backToStartLine = () => {
		dispatch(changeGameState(GameState.drawStartLane));
		dispatch(setMyTrailData(initialMyTrailData));
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

	ReactModal.setAppElement("#root");

	return (
		<StyledDashBoard>
			<h1>PEESTAAH!</h1>
			<p className="subtitle">
				Draw a track, send it to your opponent and start racing!
			</p>

			<div className="flex-box tools">
				{(gameState === GameState.start || gameState === GameState.draw) && (
					<>
						<div className="brush-color">
							<p>Brush Color</p>
							<ColorButton
								icon="add"
								onButtonClick={() => dispatch(changeColor(TRACK_COLOR))}
								brushColor={brushColor}
								color={TRACK_COLOR}
							/>
							<ColorButton
								icon="remove"
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
					</>
				)}
				{gameState === GameState.drawStartLane && (
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
				{(gameState === GameState.raceEnd ||
					raceEndState === RaceEndState.waitingOpponentFinish) && (
					<p className="no-select">
						LAP:{raceLaps}/{raceLaps}
						<br />
						GEAR:{myTrailData.gear}
						<br />
						MOVES:{myTrailData.movesNumber}
					</p>
				)}
			</div>
			{
				//end tools
			}
			<div className="flex-box actions">
				{(gameState === GameState.start ||
					gameState === GameState.draw ||
					gameState === GameState.drawStartLane ||
					gameState === GameState.trainingStart) && (
					<>
						<IconButton
							tooltip="Help"
							text="question_mark"
							onButtonClick={() => {
								setIsPopupOpen(true);
							}}
						></IconButton>
					</>
				)}

				{(gameState === GameState.start || gameState === GameState.draw) && (
					<>
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
					</>
				)}
				{gameState === GameState.trainingStart && (
					<>
						<IconButton
							text="refresh"
							tooltip="Restart Training"
							onButtonClick={() => startAgain()}
						/>
					</>
				)}
				{gameState === GameState.drawStartLane && (
					<IconButton
						text="edit"
						tooltip="Back to drawing"
						onButtonClick={() => backToDraw()}
					></IconButton>
				)}
				{gameState === GameState.trainingStart && (
					<IconButton
						text="exit_to_app"
						tooltip="Exit training"
						onButtonClick={() => backToStartLine()}
					></IconButton>
				)}
				{gameState === GameState.raceStart &&
					raceState === RaceState.waitingOpponentStart && (
						<p className="race-url">
							{`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
						</p>
					)}
				{gameState === GameState.raceStart &&
					raceState === RaceState.moving && (
						<h5 className="no-select"> Make your move!</h5>
					)}
				{gameState === GameState.raceStart &&
					raceState === RaceState.waitingOpponentMove && (
						<h5 className="no-select"> Wait for your opponent's move...</h5>
					)}
				{gameState === GameState.raceStart &&
					raceState === RaceState.lastChanceToDraw && (
						<h5 className="no-select">Your last chance to draw...</h5>
					)}

				{gameState === GameState.raceEnd &&
					raceEndState === RaceEndState.waitingOpponentFinish && (
						<div>
							<h5>Good job!</h5>
							<p> Wait for your opponent's last chance to draw...</p>
						</div>
					)}
				{gameState === GameState.raceEnd &&
					raceEndState === RaceEndState.won && <h5> YOU WON!</h5>}
				{gameState === GameState.raceEnd &&
					raceEndState === RaceEndState.lost && <h5> YOU LOST!</h5>}
				{gameState === GameState.raceEnd &&
					raceEndState === RaceEndState.draw && <h5> IT'S A DRAW!</h5>}
			</div>
			{
				//end actions
			}
			{gameState !== GameState.raceStart &&
				gameState !== GameState.trainingStart && (
					<p className="next-steps">Next steps</p>
				)}
			{(gameState === GameState.start || gameState === GameState.draw) && (
				<Button
					text="DRAW START LANE"
					onButtonClick={() =>
						dispatch(changeGameState(GameState.drawStartLane))
					}
				/>
			)}
			{gameState === GameState.drawStartLane && (
				<Button text="DO SOME TRAINING" onButtonClick={() => startTraining()} />
			)}

			{(raceEndState === RaceEndState.won ||
				raceEndState === RaceEndState.lost ||
				raceEndState === RaceEndState.draw) && (
				<>
					<Button
						text="ASK FOR A NEW ROUND"
						onButtonClick={() => otherRound()}
					/>
					<Button
						text="LEAVE THIS RACE"
						onButtonClick={() => backToDrawFromRacing()}
					/>
				</>
			)}
			{gameState === GameState.drawStartLane && (
				<Button text="START THE RACE!" onButtonClick={() => startRace()} />
			)}

			{gameState === GameState.raceStart &&
				raceState === RaceState.waitingOpponentStart && (
					<CopyToClipboard
						textToCopy={`${window.location.protocol}//${window.location.host}/${roomName}/${myId}`}
					/>
				)}
			{
				// END NEXT STEPS
			}
			<h3 className={alertMsg ? "alert-box" : ""}>{alertMsg}</h3>
			<ReactModal
				isOpen={isPopupOpen}
				contentLabel="Minimal Modal Example"
				className={"modal"}
				overlayClassName={"overlay"}
			>
				<>
					<div className="close-container">
						<IconButton
							tooltip="Close popup"
							text="close"
							onButtonClick={() => {
								setIsPopupOpen(false);
							}}
						></IconButton>
					</div>
					{gameState === GameState.draw && (
						<div className="modal-body-container">
							<img alt="track examples" src="/assets/tracks.gif" />
							<div className="text-container">
								<h1>Introduzione</h1>
								<p>
									Qesto gioco ti permette di disegnare un pista e di gareggiarci
									sopra.
									<br />I passaggi del gioco sono quattro:
								</p>
								<ul>
									<li>1. Disegno della pista</li>
									<li>2. Disegno della linea di partenza</li>
									<li>3. Invito al tuo avversario</li>
									<li>4. Gara</li>
								</ul>
								<p>
									Prima di invitare il tuo avversario potrai esercitarti a
									girare sull pista che hai appena disegnato. <br />
								</p>

								<h1>1. Disegno della "peestah"</h1>
								<p>
									Nell'area verde, che rappresenta il campo di gara, devi
									disegnare una <strong>pista nera</strong>.<br />
									Devi disegnare un anello chiuso.
									<br />
									Non puoi disegnare fuori dalla linea tratteggiata rossa,
									<br />
									che rappresenta il confine del campo di gara.
									<br /> Puoi disegnare bivi, ma sappi che il tuo avversario
									potrà
									<br />
									scegliere sempre la via più breve verso il traguardo.
									<br />
									A destra puoi cambiare il colore e la grandezza del pennello
									<br />
									Durante la fase di disegno puoi anche salvare una pista e
									caricarla in seguito.
								</p>
							</div>
						</div>
					)}
					{gameState === GameState.drawStartLane && (
						<>
							<img alt="start lane" src="/assets/start_lane.gif" />
						</>
					)}
					{gameState === GameState.trainingStart && (
						<>
							<div>
								<img alt="start lane" src="/assets/progressione_marce.png" />
							</div>
							<div>
								<img alt="start lane" src="/assets/angoli.gif" />
							</div>
							<div>
								<img alt="start lane" src="/assets/incidente.gif" />
							</div>
						</>
					)}
				</>
			</ReactModal>
		</StyledDashBoard>
	);
};
export default DashBoard;
