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
} from "./socketClientSlice";
import {
	selectMyTrailData,
	selectTrackData,
	setOpponentTrailData,
	setTrackData,
} from "../grid/gridSlice";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import { GameState, RaceEndState, RaceState } from "../constants";
import { useNavigate } from "react-router-dom";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
import { OpponentTrailData } from "../types";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
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

	useEffect(() => {
		//socket  emit
		/**
		 * register second player if there is a roomName and a OpponentId from queryString
		 *
		 */
		if (roomName && opponentId && gameState === GameState.start) {
			socket.emit("registerPlayer", null, roomName);
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
			socket.emit("registerPlayer", trackData, null);
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
			console.log("firstToFinishRace");
			socket.emit("firstToFinishRace", myTrailPoint[myTrailPoint.length - 1]);
			dispatch(setRaceEndState(RaceEndState.waitingOpponentFinish));
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
		socket.on("draw", (playerIdMoved, trailPoint) => {
			if (playerIdMoved !== myPlayerId) {
				console.log("DRAW");
				const opTrailData: OpponentTrailData = { trailPoint };
				dispatch(setOpponentTrailData(opTrailData));
				dispatch(setRaceState(RaceState.end));
				dispatch(setRaceEndState(RaceEndState.draw));
			}
		});
		return () => {
			socket.off("update");
			socket.off("setPlayer1");
			socket.off("setPlayer2");
			socket.off("lastChance");
			socket.off("won");
			socket.off("draw");
		};
	});

	return <></>;
};
export default SocketClient;
