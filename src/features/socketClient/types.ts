import { OpponentTrailData, PathPoint, TrackData } from "../types";
export interface ServerToClientEvents {
	setPlayer1: (roomname: string, playerId: string) => void;
	setPlayer2: (trackData: TrackData, playerId: string) => void;
	update: (playerMoving: string, newPointMove: OpponentTrailData) => void;
}

export interface ClientToServerEvents {
	registerPlayer: (
		trackData: TrackData | null,
		roomname: string | null
	) => void;
	moved: (point: PathPoint) => void;
}
