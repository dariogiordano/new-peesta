import React from "react";

import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import DrawBoard from "./features/drawBoard";
import DashBoard from "./features/dashBoard";
import Grid from "./features/grid";
import NoRouteMatch from "./features/noRouteMatch";
import SocketClient from "./features/socketClient";
import LoadQueryData from "./features/socketClient/loadQueryData";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Navigate replace to="/draw" />} />
				<Route path="/draw" element={<DrawBoard />} />
				<Route path="/play" element={<Grid />} />
				<Route path="/:pRoomName">
					<Route path="/:pRoomName/:pOpponentId" element={<LoadQueryData />} />
				</Route>
				<Route path="*" element={<NoRouteMatch />} />
			</Routes>
			<DashBoard />
			<SocketClient />
		</div>
	);
}

export default App;
