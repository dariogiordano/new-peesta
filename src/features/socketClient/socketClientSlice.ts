// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../app/store";
import { RaceEndState, RaceState } from "../constants";

export interface DashBoardState {
	roomName: string | null;
	myPlayerId: string | null;
	opponentId: string | null;
	raceState: RaceState;
	raceEndState: RaceEndState;
}

const initialState: DashBoardState = {
	myPlayerId: null,
	opponentId: null,
	roomName: null,
	raceState: RaceState.start,
	raceEndState: RaceEndState.racing,
};

export const socketClientSlice = createSlice({
	name: "socketClient",
	initialState,
	reducers: {
		setRaceEndState: (state, action: PayloadAction<RaceEndState>) => {
			state.raceEndState = action.payload;
		},
		setMyPlayerId: (state, action: PayloadAction<string | null>) => {
			state.myPlayerId = action.payload;
		},

		setOpponentId: (state, action: PayloadAction<string | null>) => {
			state.opponentId = action.payload;
		},
		setRoomName: (state, action: PayloadAction<string | null>) => {
			state.roomName = action.payload;
		},
		setRaceState: (state, action: PayloadAction<RaceState>) => {
			state.raceState = action.payload;
		},
	},
});

export const {
	setMyPlayerId,
	setOpponentId,
	setRoomName,
	setRaceState,
	setRaceEndState,
} = socketClientSlice.actions;
export const selectMyPlayerId = (state: RootState) =>
	state.socketClient.myPlayerId;
export const selectRaceState = (state: RootState) =>
	state.socketClient.raceState;
export const selectOpponentId = (state: RootState) =>
	state.socketClient.opponentId;
export const selectRoomName = (state: RootState) => state.socketClient.roomName;
export const selectRaceEndState = (state: RootState) =>
	state.socketClient.raceEndState;
export default socketClientSlice.reducer;
