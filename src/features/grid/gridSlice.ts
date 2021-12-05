// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { BG_COLOR, TRACK_COLOR } from "../constants";
import { Dimensions, Gear, IGrid, PathPoint, Point, StartLane } from "../types";

export type BrushColor = typeof TRACK_COLOR | typeof BG_COLOR;

type GridData = [dimensions: Dimensions, grid: IGrid, imgData: string];
export interface gridState {
	raceLaps: number;
	currentLap: number;
	isMoving: boolean;
	startLaneStart?: Point;
	startLane?: StartLane;
	grid: IGrid;
	loading: false;
	trailPoints: PathPoint[];
	gear: Gear;
	alertMsg: string;
	imgData?: string;
	dimensions: Dimensions;
	startLanePosition: Point | null;
}

const initialState: gridState = {
	currentLap: 1,
	raceLaps: 1,
	isMoving: false,
	grid: [],
	loading: false,
	trailPoints: [],
	gear: 0,
	alertMsg: "",
	dimensions: { w: 100, h: 100 },
	startLanePosition: null,
};

export const gridSlice = createSlice({
	name: "grid",
	initialState,
	reducers: {
		setGridData: (state, action: PayloadAction<GridData>) => {
			[state.dimensions, state.grid, state.imgData] = action.payload;
		},
		setStartLane: (state, action: PayloadAction<StartLane>) => {
			state.startLane = action.payload;
		},
		setStartLanePosition: (state, action: PayloadAction<Point | null>) => {
			state.startLanePosition = action.payload;
		},
		setStartLaneStart: (state, action: PayloadAction<Point>) => {
			state.startLaneStart = action.payload;
		},
		setIsMoving: (state, action: PayloadAction<boolean>) => {
			state.isMoving = action.payload;
		},
		setAlertMsg: (state, action: PayloadAction<string>) => {
			state.alertMsg = action.payload;
		},
		setTrailPoints: (state, action: PayloadAction<PathPoint[]>) => {
			state.trailPoints = action.payload;
		},
		setGear: (state, action: PayloadAction<Gear>) => {
			state.gear = action.payload;
		},
		setCurrentLap: (state, action: PayloadAction<number>) => {
			state.currentLap = action.payload;
		},
	},
});

export const {
	setGridData,
	setStartLane,
	setStartLaneStart,
	setIsMoving,
	setAlertMsg,
	setTrailPoints,
	setGear,
	setCurrentLap,
	setStartLanePosition,
} = gridSlice.actions;
export const selectGridData = (state: RootState) => [
	state.grid.dimensions,
	state.grid.grid,
	state.grid.imgData,
];

export const selectIsmoving = (state: RootState) => state.grid.isMoving;
export const selectGear = (state: RootState) => state.grid.gear;
export const selectAlertMsg = (state: RootState) => state.grid.alertMsg;
export const selectRaceLaps = (state: RootState) => state.grid.raceLaps;
export const selectTrailPoints = (state: RootState) => state.grid.trailPoints;
export const selectStartLane = (state: RootState) => state.grid.startLane;
export const selectCurrentLap = (state: RootState) => state.grid.currentLap;
export const selectStartLanePosition = (state: RootState) =>
	state.grid.startLanePosition;
export const selectStartLaneStart = (state: RootState) =>
	state.grid.startLaneStart;

export default gridSlice.reducer;
