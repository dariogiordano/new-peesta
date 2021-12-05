// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { BG_COLOR, CELL_SIZE, TRACK_COLOR } from "../constants";

export type BrushColor = typeof TRACK_COLOR | typeof BG_COLOR;

export interface DrawBoardState {
	brushColor: BrushColor;
	brushSize: number;
	dataUrl: string;
	externalDataUrl?: string;
}

const initialState: DrawBoardState = {
	brushColor: TRACK_COLOR,
	brushSize: CELL_SIZE * 3,
	dataUrl: "",
};

export const drawBoardSlice = createSlice({
	name: "drawBoard",
	initialState,
	reducers: {
		changeColor: (state, action: PayloadAction<BrushColor>) => {
			state.brushColor = action.payload;
		},
		changeSize: (state, action: PayloadAction<number>) => {
			state.brushSize = action.payload;
		},
		setDataUrl: (state, action: PayloadAction<string>) => {
			state.dataUrl = action.payload;
		},
		setExternalDataUrl: (state, action: PayloadAction<string>) => {
			state.externalDataUrl = action.payload;
		},
		removeExternalDataUrl: (state) => {
			state.externalDataUrl = undefined;
		},
	},
});

// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const {
	changeColor,
	changeSize,
	setDataUrl,
	setExternalDataUrl,
	removeExternalDataUrl,
} = drawBoardSlice.actions;
export const selectColor = (state: RootState) => state.drawBoard.brushColor;
export const selectSize = (state: RootState) => state.drawBoard.brushSize;
export const selectDataUrl = (state: RootState) => state.drawBoard.dataUrl;
export const selectExternalDataUrl = (state: RootState) =>
	state.drawBoard.externalDataUrl;
export default drawBoardSlice.reducer;
