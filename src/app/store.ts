import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import drawBoardReducer from "../features/drawBoard/drawBoardSlice";
import dashBoardReducer from "../features/dashBoard/dashBoardSlice";
import gridReducer from "../features/grid/gridSlice";

export const store = configureStore({
	reducer: {
		drawBoard: drawBoardReducer,
		dashBoard: dashBoardReducer,
		grid: gridReducer,
	},
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
