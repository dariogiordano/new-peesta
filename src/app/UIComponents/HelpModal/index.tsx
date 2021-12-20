import React from "react";
import { GameState } from "../../../features/constants";
import { selectGameState } from "../../../features/dashBoard/dashBoardSlice";
import { useAppSelector } from "../../hooks";

const HelpModal = () => {
	const gameState = useAppSelector(selectGameState);
	return (
		<div className="modal-body-wrapper">
			{gameState === GameState.draw && (
				<div className="modal-body-container">
					<div className="img-container">
						<img alt="track examples" src="/assets/tracks.gif" />
					</div>
					<div className="text-container">
						<h1>Introduction</h1>
						<p>
							This game allows you to design a track and compete over it.
							<br /> There are four steps in the game:
						</p>
						<ul>
							<li> 1. Track design </li>
							<li> 2. Starting line drawing </li>
							<li> 3. Invite your opponent </li>
							<li> 4. Race </li>
						</ul>
						<p>
							Before inviting your opponent, you can practice on the track you
							just drew. <br />
						</p>

						<h1>Track design</h1>
						<p>
							In the green area, which represents the competition field, you
							have to draw a <strong> black run</strong>. <br />
							You need to draw a closed loop.
							<br />
							You can't draw outside the red dashed line, that represents the
							boundary of the competition field.
							<br /> You can draw crossroads, but be aware that your opponent
							can always choose the shortest way to the finish line.
							<br />
							At this stage in the right panel you will find the tools to change
							the color (black to draw the track, green to erase it) and the
							size of the brush.
							<br />
							During the drawing phase you can also save a track and load it
							later.
						</p>
					</div>
				</div>
			)}
			{gameState === GameState.drawStartLane && (
				<div className="modal-body-container">
					<div className="img-container">
						<img alt="start lane" src="/assets/start_lane.gif" />
					</div>
					<div className="text-container">
						<h1>Starting line drawing</h1>
						<p>
							Now you have to decide where to place the starting line.
							<br />
							Click on the track and drag the mouse. Yellow triangles will
							appear, that indicate the direction of travel and the start
							positions of the race.
							<br />
							On the second click you will fix the position of the line and the
							direction of travel.
							<br />
							The starting line must necessarily cross the track.
						</p>

						<p>
							At this stage you also have to decide how many laps it will your
							race have, from a minimum of one to a maximum of five.
						</p>
					</div>
				</div>
			)}
			{(gameState === GameState.trainingStart ||
				gameState === GameState.raceStart) && (
				<div className="modal-body-container">
					<div className="text-container">
						<h1>Race Rules</h1>
						<p>
							The purpose of the game is to finish the race with fewer moves
							than your opponent. The race starts by clicking on one of the
							points of the starting line and making the first move in the
							direction of travel (as indicated by the yellow arrows).
						</p>
						<p>
							<img alt="change gear" src="/assets/cambio-marcia.gif" />
						</p>
						<p>
							Your move starts with a first click, then moving the mouse you
							will be able to see all destination points possible and finally,
							clicking again, you will conclude. The possible destination points
							depend on where you are and the "gear" you arrived there with. Any
							move will be as long as the previous one or raise or decrease by
							one unit (gear). You can move only by 45° angles and you cannot
							make a U turn.
						</p>
						<p>
							<img alt="angles" src="/assets/angoli.gif" />
						</p>
						<p>
							If all your possible moves go off track, then you are about to
							make a crash: in this case your position will be marked as the
							point closest to the runway in the trajectory taken, and the your
							gear drops back to 0.
						</p>
						<p>
							<img alt="crash" src="/assets/incidente.gif" />
						</p>
						<p>
							If you cross the finish line with the same number of moves as
							yours opponent, the race ends in a draw.
						</p>
					</div>
				</div>
			)}
		</div>
	);
};
export default HelpModal;
