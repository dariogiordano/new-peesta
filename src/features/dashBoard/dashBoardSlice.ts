// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { GameState } from "../constants";

export interface DashBoardState {
	gameState: GameState;
	istructionsOpen: boolean;
}

const initialState: DashBoardState = {
	gameState: GameState.start,
	istructionsOpen: false,
};

export const dashBoardSlice = createSlice({
	name: "dashBoard",
	initialState,
	reducers: {
		changeGameState: (state, action: PayloadAction<GameState>) => {
			state.gameState = action.payload;
		},
		setInstructionsOpen: (state, action: PayloadAction<boolean>) => {
			state.istructionsOpen = action.payload;
		},
	},
});

export const { changeGameState, setInstructionsOpen } = dashBoardSlice.actions;
export const selectGameState = (state: RootState) => state.dashBoard.gameState;
export const selectInstructionsOpen = (state: RootState) =>
	state.dashBoard.istructionsOpen;
export default dashBoardSlice.reducer;
