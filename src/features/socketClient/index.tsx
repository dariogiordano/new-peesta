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
} from "./socketClientSlice";
import {
	selectMyTrailData,
	selectTrackData,
	setOpponentTrailData,
	setTrackData,
} from "../grid/gridSlice";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import { GameState, RaceState } from "../constants";
import { useNavigate } from "react-router-dom";
import { ClientToServerEvents, ServerToClientEvents } from "./types";
const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
const SocketClient = () => {
	const dispatch = useAppDispatch();
	const myTrailPoint = useAppSelector(selectMyTrailData).trailPoints;
	const roomName = useAppSelector(selectRoomName);
	const raceState = useAppSelector(selectRaceState);
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
		if (raceState === RaceState.moved) {
			console.log(myTrailPoint[myTrailPoint.length - 1]);
			socket.emit("moved", myTrailPoint[myTrailPoint.length - 1]);
			dispatch(setRaceState(RaceState.waitingOpponentMove));
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

		socket.on("update", (playerIdMoved, newPointMove) => {
			console.log(playerIdMoved + " - " + myPlayerId);
			if (playerIdMoved !== myPlayerId) {
				dispatch(setOpponentTrailData(newPointMove));
				dispatch(setRaceState(RaceState.moving));
			} else {
				dispatch(setRaceState(RaceState.waitingOpponentMove));
			}
		});
		return () => {
			socket.off("update");
			socket.off("setPlayer1");
			socket.off("setPlayer2");
		};
	});

	return <></>;
};
export default SocketClient;
