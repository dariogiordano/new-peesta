// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { BG_COLOR, TRACK_COLOR } from "../constants";
import {
	Gear,
	PathPoint,
	Point,
	StartLane,
	TrackData,
	MyTrailData,
	OpponentTrailData,
} from "../types";

export type BrushColor = typeof TRACK_COLOR | typeof BG_COLOR;

export interface matchState {
	trackData: TrackData;
	myTrailData: MyTrailData;
	opponentTrailData?: OpponentTrailData;
	alertMsg: string;
	playerMoving: string | null;
}

export const initialMyTrailData: MyTrailData = {
	currentLap: 1,
	trailPoints: [],
	gear: 0,
	isMoving: false,
	movesNumber: 0,
	startLanePosition: null,
};

const initialState: matchState = {
	playerMoving: null,
	trackData: {
		raceLaps: 1,
		dimensions: { w: 100, h: 100 },
		startLane: {
			arrowPoints: null,
			arrows: null,
			directionOfTravel: null,
			point1: null,
			point2: null,
			points: null,
		},
		imgData: null,
		grid: [],
	},
	myTrailData: initialMyTrailData,
	alertMsg: "",
};

export const gridSlice = createSlice({
	name: "grid",
	initialState,
	reducers: {
		resetInitialState: (state) => {
			state.myTrailData = initialState.myTrailData;
			state.trackData = initialState.trackData;
			state.alertMsg = initialState.alertMsg;
		},

		setPlayerMoving: (state, action: PayloadAction<string>) => {
			state.playerMoving = action.payload;
		},
		setTrackData: (state, action: PayloadAction<TrackData>) => {
			state.trackData = action.payload;
		},
		setMyTrailData: (state, action: PayloadAction<MyTrailData>) => {
			state.myTrailData = action.payload;
		},
		setMyMovesNumber: (state, action: PayloadAction<number>) => {
			state.myTrailData.movesNumber = action.payload;
		},
		setStartLane: (state, action: PayloadAction<StartLane | null>) => {
			state.trackData.startLane = action.payload;
		},

		setMyStartLanePosition: (state, action: PayloadAction<Point | null>) => {
			state.myTrailData.startLanePosition = action.payload;
		},

		setMyIsMoving: (state, action: PayloadAction<boolean>) => {
			state.myTrailData.isMoving = action.payload;
		},
		setAlertMsg: (state, action: PayloadAction<string>) => {
			state.alertMsg = action.payload;
		},
		setMyTrailPoints: (state, action: PayloadAction<PathPoint[]>) => {
			state.myTrailData.trailPoints = action.payload;
		},
		setMyGear: (state, action: PayloadAction<Gear>) => {
			state.myTrailData.gear = action.payload;
		},
		setMyCurrentLap: (state, action: PayloadAction<number>) => {
			state.myTrailData.currentLap = action.payload;
		},
		setOpponentTrailData: (state, action: PayloadAction<OpponentTrailData>) => {
			state.opponentTrailData = action.payload;
		},
	},
});

export const {
	setTrackData,
	setMyTrailData,
	setStartLane,
	setMyIsMoving,
	setAlertMsg,
	setMyTrailPoints,
	setMyGear,
	setMyCurrentLap,
	setMyStartLanePosition,
	resetInitialState,
	setMyMovesNumber,
	setPlayerMoving,
	setOpponentTrailData,
} = gridSlice.actions;
export const selectTrackData = (state: RootState) => state.grid.trackData;
export const selectPlayerMoving = (state: RootState) => state.grid.playerMoving;
export const selectMyTrailData = (state: RootState) => state.grid.myTrailData;
export const selectOpponentTrailData = (state: RootState) =>
	state.grid.opponentTrailData;
export const selectMyMovesNumber = (state: RootState) =>
	state.grid.myTrailData.movesNumber;
export const selectMyIsmoving = (state: RootState) =>
	state.grid.myTrailData.isMoving;
export const selectMyGear = (state: RootState) => state.grid.myTrailData.gear;
export const selectAlertMsg = (state: RootState) => state.grid.alertMsg;
export const selectRaceLaps = (state: RootState) =>
	state.grid.trackData.raceLaps;
export const selectMyTrailPoints = (state: RootState) =>
	state.grid.myTrailData.trailPoints;
export const selectStartLane = (state: RootState) =>
	state.grid.trackData.startLane;
export const selectMyCurrentLap = (state: RootState) =>
	state.grid.myTrailData.currentLap;
export const selectMyStartLanePosition = (state: RootState) =>
	state.grid.myTrailData.startLanePosition;

export default gridSlice.reducer;
