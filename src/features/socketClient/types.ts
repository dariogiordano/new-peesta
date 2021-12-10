import { PathPoint, TrackData } from "../types";
export interface ServerToClientEvents {
	setPlayer1: (roomname: string, playerId: string) => void;
	setPlayer2: (trackData: TrackData, playerId: string) => void;
	update: (playerMoving: string, newPointMove: PathPoint) => void;
	lastChance: (playerMoving: string, newPointMove: PathPoint) => void;
	won: (playerMoving: string, newPointMove: PathPoint) => void;
	draw: (playerMoving: string, newPointMove: PathPoint) => void;
	leftAlone: () => void;
	error: (playerId: string) => void;
}

export interface ClientToServerEvents {
	registerPlayer: (
		trackData: TrackData | null,
		roomname: string | null
	) => void;
	moved: (point: PathPoint) => void;
	firstToFinishRace: (point: PathPoint) => void;
	lost: (point: PathPoint) => void;
	draw: (point: PathPoint) => void;
	playerWillUnregister: () => void;
}
