// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { GameState } from "../constants";

export interface DashBoardState {
	gameState: GameState;
}

const initialState: DashBoardState = {
	gameState: GameState.start,
};

export const dashBoardSlice = createSlice({
	name: "dashBoard",
	initialState,
	reducers: {
		changeGameState: (state, action: PayloadAction<GameState>) => {
			state.gameState = action.payload;
		},
	},
});

export const { changeGameState } = dashBoardSlice.actions;
export const selectGameState = (state: RootState) => state.dashBoard.gameState;
export default dashBoardSlice.reducer;
