import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	selectRaceState,
	selectMyPlayerId,
	selectOpponentId,
	selectRoomName,
	setRaceState,
	setMyPlayerId,
	setRoomName,
	setRaceEndState,
	selectRaceEndState,
	setOpponentId,
} from "./socketClientSlice";
import {
	resetForNewRound,
	resetInitialState,
	selectMyTrailData,
	selectPlayerType,
	selectTrackData,
	setAlertMsg,
	setOpponentTrailData,
	setPlayerType,
	setTrackData,
} from "../grid/gridSlice";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import { GameState, RaceEndState, RaceState } from "../constants";
import { useNavigate } from "react-router-dom";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { OpponentTrailData, PlayerType } from "../types";
export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
const SocketClient = () => {
	const dispatch = useAppDispatch();
	const myTrailPoint = useAppSelector(selectMyTrailData).trailPoints;
	const roomName = useAppSelector(selectRoomName);
	const raceState = useAppSelector(selectRaceState);
	const raceEndState = useAppSelector(selectRaceEndState);
	const opponentId = useAppSelector(selectOpponentId);
	const trackData = useAppSelector(selectTrackData);
	const gameState = useAppSelector(selectGameState);
	const navigate = useNavigate();
	const myPlayerId = useAppSelector(selectMyPlayerId);
	const myPlayerType = useAppSelector(selectPlayerType);

	useEffect(() => {
		//socket  emit
		/**
		 * register second player if there is a roomName and a OpponentId from queryString
		 *
		 */
		if (roomName && opponentId && gameState === GameState.start) {
			socket.emit("registerPlayer", null, roomName);
			dispatch(setPlayerType(PlayerType.opponent));
			dispatch(changeGameState(GameState.raceStart));
			dispatch(setRaceState(RaceState.waitingOpponentMove));
		}

		/**
		 * register first player pushing trackData
		 *
		 */
		if (
			trackData &&
			gameState === GameState.raceStart &&
			raceState === RaceState.start
		) {
			console.log(gameState);
			socket.emit("registerPlayer", trackData, null);
			dispatch(setPlayerType(PlayerType.starter));
			dispatch(setRaceState(RaceState.waitingOpponentStart));
		}

		if (gameState === GameState.raceStart && raceState === RaceState.moved) {
			console.log("moved");
			socket.emit("moved", myTrailPoint[myTrailPoint.length - 1]);
			dispatch(setRaceState(RaceState.waitingOpponentMove));
		}
		if (
			gameState === GameState.raceEnd &&
			raceEndState === RaceEndState.racing
		) {
			if (myPlayerType === PlayerType.opponent) {
				console.log("won");
				socket.emit("won", myTrailPoint[myTrailPoint.length - 1]);
				dispatch(changeGameState(GameState.raceEnd));
				dispatch(setRaceState(RaceState.end));
				dispatch(setRaceEndState(RaceEndState.won));
			} else {
				console.log("firstToFinishRace");
				socket.emit("firstToFinishRace", myTrailPoint[myTrailPoint.length - 1]);
				dispatch(setRaceEndState(RaceEndState.waitingOpponentFinish));
			}
		}
		if (
			gameState === GameState.raceStart &&
			raceEndState === RaceEndState.lost
		) {
			console.log("lost");
			socket.emit("lost", myTrailPoint[myTrailPoint.length - 1]);
			dispatch(changeGameState(GameState.raceEnd));
			dispatch(setRaceState(RaceState.end));
		}

		if (
			raceState === RaceState.lastChanceToDraw &&
			raceEndState === RaceEndState.draw
		) {
			console.log("draw");
			socket.emit("draw", myTrailPoint[myTrailPoint.length - 1]);
			dispatch(changeGameState(GameState.raceEnd));
			dispatch(setRaceState(RaceState.end));
		}

		//socket On
		socket.on("setPlayer2", (tData, playerId) => {
			if (!myPlayerId) {
				dispatch(setMyPlayerId(playerId));
				dispatch(setTrackData(tData));
				navigate("/play");
			} else {
				dispatch(setRaceState(RaceState.moving));
			}
		});

		//socket On
		socket.on("newRound", (playerId) => {
			if (myPlayerId !== playerId) {
				dispatch(changeGameState(GameState.raceStart));
				dispatch(resetForNewRound());
				dispatch(setPlayerType(PlayerType.starter));
				dispatch(setRaceEndState(RaceEndState.racing));
				dispatch(setRaceState(RaceState.moving));
				dispatch(setAlertMsg("Your opponent asked for a new round. Let'go!"));
			}
		});

		socket.on("setPlayer1", (rName, playerId) => {
			dispatch(setRoomName(rName));
			dispatch(setMyPlayerId(playerId));
		});

		socket.on("update", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.moving));
			}
		});

		socket.on("lastChance", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.lastChanceToDraw));
			}
		});

		socket.on("won", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.end));
				dispatch(setRaceEndState(RaceEndState.won));
			}
		});

		socket.on("lost", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.end));
				dispatch(setRaceEndState(RaceEndState.lost));
			}
		});

		socket.on("draw", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				console.log("DRAW");
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.end));
				dispatch(setRaceEndState(RaceEndState.draw));
			}
		});

		socket.on("leftAlone", () => {
			console.log("leftalone");
			socket.close();
			dispatch(setRoomName(null));
			dispatch(setOpponentId(null));
			dispatch(changeGameState(GameState.start));
			dispatch(resetInitialState());
			dispatch(setRaceState(RaceState.start));
			dispatch(setRaceEndState(RaceEndState.racing));
			navigate("/draw");
			dispatch(setAlertMsg("Your opponent left the race."));
			socket.open();
		});

		socket.on("error", (playerId) => {
			console.log("error: ", opponentId, playerId);
			if (opponentId === playerId) {
				dispatch(resetInitialState());
				dispatch(changeGameState(GameState.start));
				navigate("/error");
				dispatch(setAlertMsg("An error occurred"));
			}
		});

		return () => {
			socket.off("newRound");
			socket.off("error");
			socket.off("leftAlone");
			socket.off("update");
			socket.off("setPlayer1");
			socket.off("setPlayer2");
			socket.off("lastChance");
			socket.off("won");
			socket.off("draw");
			socket.off("lost");
		};
	});

	return <></>;
};

export default SocketClient;
