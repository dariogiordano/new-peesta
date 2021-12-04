import React from "react";

import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import DrawBoard from "./features/drawBoard";
import DashBoard from "./features/dashBoard";
import Grid from "./features/grid";

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<Navigate replace to="/draw" />} />
				<Route path="/draw" element={<DrawBoard />} />
				<Route path="/play" element={<Grid />} />
			</Routes>
			<DashBoard />
		</div>
	);
}

export default App;
