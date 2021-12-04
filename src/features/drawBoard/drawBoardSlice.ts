// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { BG_COLOR, CELL_SIZE, TRACK_COLOR } from "../constants";

export type BrushColor = typeof TRACK_COLOR | typeof BG_COLOR;

export interface DrawBoardState {
	brushColor: BrushColor;
	brushSize: number;
}

const initialState: DrawBoardState = {
	brushColor: TRACK_COLOR,
	brushSize: CELL_SIZE * 3,
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
	},
});

// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const { changeColor, changeSize } = drawBoardSlice.actions;
export const selectColor = (state: RootState) => state.drawBoard.brushColor;
export const selectSize = (state: RootState) => state.drawBoard.brushSize;
export default drawBoardSlice.reducer;
