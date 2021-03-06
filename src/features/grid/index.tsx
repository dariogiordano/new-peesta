import { CSSProperties } from "hoist-non-react-statics/node_modules/@types/react";
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	CELL_SIZE,
	GameState,
	RaceEndState,
	RaceState,
	TRAIL_COLOR,
	TRAIL_LENGTH,
} from "../constants";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import {
	setRaceState,
	selectRaceState,
	setRaceEndState,
} from "../socketClient/socketClientSlice";
import {
	Direction,
	GridValue,
	MoveStatus,
	PathPoint,
	Point,
	Segment,
	StartLane,
} from "../types";
import {
	getGridValue,
	getMoveDetails,
	getPointAndDir,
	getStartLane,
	isOutOfRange,
	isPointInSegment,
	isUTurn,
	isValidStartLane,
} from "./gridAPI";
import {
	selectTrackData,
	setAlertMsg,
	setMyCurrentLap,
	setMyGear,
	setMyIsMoving,
	setStartLane,
	setMyStartLanePosition,
	setMyTrailPoints,
	setMyMovesNumber,
	selectMyTrailData,
	selectOpponentTrailData,
	selectRaceLaps,
	setMyTrailData,
	initialMyTrailData,
} from "./gridSlice";
import StyledGrid from "./styled";
import SvgBoard from "./svgBoard";

const Grid = () => {
	const gameState: GameState = useAppSelector(selectGameState);
	const raceState: RaceState = useAppSelector(selectRaceState);
	const startLaneStartRef = useRef<Point>({ x: 50000, y: 50000 });
	const myTrailData = useAppSelector(selectMyTrailData);
	const trackData = useAppSelector(selectTrackData);
	const opponentTrailData = useAppSelector(selectOpponentTrailData);
	const dispatch = useAppDispatch();
	const lastPointRef = useRef<Point>({ x: 0, y: 0 });
	const raceLaps = useAppSelector(selectRaceLaps);
	const navigate = useNavigate();
	const directionHistoryRef = useRef<Direction>("");
	useEffect(() => {
		if (trackData.grid.length === 0) navigate("/draw");
	});

	const isRacing = (): boolean => {
		return (
			gameState === GameState.trainingStart ||
			(gameState === GameState.raceStart &&
				(raceState === RaceState.moving ||
					raceState === RaceState.lastChanceToDraw))
		);
	};

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const point: Point = {
			x:
				Math.floor(
					(e.clientX -
						e.currentTarget.getBoundingClientRect().left +
						CELL_SIZE / 2) /
						CELL_SIZE
				) * CELL_SIZE,
			y:
				Math.floor(
					(e.clientY -
						e.currentTarget.getBoundingClientRect().top +
						CELL_SIZE / 2) /
						CELL_SIZE
				) * CELL_SIZE,
		};
		//disegno della start lane
		if (gameState === GameState.drawStartLane) {
			if (!myTrailData.isMoving) {
				lastPointRef.current = point;
				if (getGridValue(point, trackData.grid) === GridValue.track) {
					dispatch(setStartLane(null));
					startLaneStartRef.current = point;
					dispatch(setMyIsMoving(true));
					dispatch(setAlertMsg(""));
				} else
					dispatch(
						setAlertMsg("click a point on the track to add the start lane.")
					);
			} else if (
				trackData.startLane &&
				isValidStartLane(trackData.startLane, trackData.grid)
			) {
				dispatch(setMyIsMoving(false));
				dispatch(setAlertMsg(""));
			} else {
				dispatch(setMyIsMoving(false));
				dispatch(
					setAlertMsg("Please add a start lane that crosses your track")
				);
				dispatch(setStartLane(null));
			}
		} else if (isRacing()) {
			if (!myTrailData.isMoving) {
				//registro lastPoint per attivare il sistema che evita
				//la ripetizione dell'evento in caso di movimento
				//del mouse dentro la cella x,y
				lastPointRef.current = point;
				//segno il punto di partenza sulla linea di partenza

				if (
					trackData.startLane &&
					isPointInSegment(point, trackData.startLane.arrowPoints as Segment) &&
					myTrailData.trailPoints.length === 0
				) {
					dispatch(setMyIsMoving(true));
					dispatch(setAlertMsg(""));
					dispatch(setMyTrailPoints([point]));
				} else if (trackData.startLane && myTrailData.trailPoints.length > 0) {
					dispatch(setMyIsMoving(true));
					dispatch(setAlertMsg(""));
					dispatch(
						setMyTrailPoints(
							getMoveDetails(
								myTrailData.trailPoints,
								point,
								MoveStatus.start,
								myTrailData.gear,
								trackData.startLane,
								trackData.grid,
								myTrailData.currentLap,
								trackData.raceLaps
							).points
						)
					);
				} else {
					dispatch(setAlertMsg("Click on a point on start lane to start"));
				}
			} else if (trackData.startLane) {
				const moveDetails = getMoveDetails(
					myTrailData.trailPoints,
					point,
					MoveStatus.moved,
					myTrailData.gear,
					trackData.startLane,
					trackData.grid,
					myTrailData.currentLap,
					trackData.raceLaps
				);
				/*
        if (moveDetails.points...
        points NON viene restituito da get Move Details in caso di ripartenza dopo un incidente verso un punto NON sulla pista 
        */
				if (
					moveDetails.points &&
					!isOutOfRange(moveDetails.points, trackData.dimensions) &&
					!isUTurn(
						moveDetails.direction,
						directionHistoryRef.current as Direction,
						trackData.startLane,
						myTrailData.gear,
						myTrailData.trailPoints
					) &&
					moveDetails.finishLineInfo !== "wrong direction"
				) {
					const newMoveNumber = myTrailData.movesNumber + 1;
					dispatch(setMyMovesNumber(newMoveNumber));
					directionHistoryRef.current = moveDetails.direction;
					//setto un variabile locale per currentlap altrimenti se la gara finisce devo aspettare la mossa successiva per accorgermene
					let newCurrentLap = myTrailData.currentLap;
					if (moveDetails.finishLineInfo === "one lap less to go") {
						newCurrentLap += 1;
						dispatch(setMyCurrentLap(newCurrentLap));
					}
					dispatch(setMyIsMoving(false));

					dispatch(
						setAlertMsg(
							moveDetails.finishLineInfo === "incident at cut line"
								? "OMG! you crashed on finish line!!!"
								: ""
						)
					);
					dispatch(setMyTrailPoints(moveDetails.points));
					dispatch(setMyGear(moveDetails.isCrash ? 0 : moveDetails.gear));

					/*this tells system that the move ended so the info
					can be emitted via socket to the opponent. in the meantime it sets the GameState, RaceState and RaceEndState*/

					if (newCurrentLap === raceLaps + 1) {
						if (gameState === GameState.trainingStart) {
							dispatch(
								setAlertMsg(`It took you ${newMoveNumber} moves. Good job!`)
							);
							dispatch(changeGameState(GameState.drawStartLane));
							dispatch(setMyTrailData(initialMyTrailData));
						}

						if (gameState === GameState.raceStart)
							dispatch(changeGameState(GameState.raceEnd));
						if (raceState === RaceState.lastChanceToDraw)
							dispatch(setRaceEndState(RaceEndState.draw));
					} else if (
						gameState === GameState.raceStart &&
						raceState === RaceState.lastChanceToDraw
					) {
						dispatch(setRaceEndState(RaceEndState.lost));
						dispatch(setRaceState(RaceState.end));
					} else if (
						gameState === GameState.raceStart &&
						raceState === RaceState.moving
					) {
						dispatch(setRaceState(RaceState.moved));
					}
				}
			}
		}
	};

	const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const point: Point = {
			x:
				Math.floor(
					(e.clientX -
						e.currentTarget.getBoundingClientRect().left +
						CELL_SIZE / 2) /
						CELL_SIZE
				) * CELL_SIZE,
			y:
				Math.floor(
					(e.clientY -
						e.currentTarget.getBoundingClientRect().top +
						CELL_SIZE / 2) /
						CELL_SIZE
				) * CELL_SIZE,
		};

		if (
			e.clientX >= lastPointRef.current.x - CELL_SIZE / 2 &&
			e.clientX < lastPointRef.current.x + CELL_SIZE / 2 &&
			e.clientY >= lastPointRef.current.y - CELL_SIZE / 2 &&
			e.clientY < lastPointRef.current.y + CELL_SIZE / 2
		) {
			return;
		}

		lastPointRef.current = point;

		//Aggiunge un cerchio di posizione attorno al punto per evidenziare la posizione quando sto piazzando la linea di partenza
		if (gameState === GameState.drawStartLane) {
			dispatch(
				setMyStartLanePosition(
					getGridValue(point, trackData.grid) === GridValue.track ? point : null
				)
			);
		}
		//Aggiunge un cerchio di posizione attorno al punto sulla linea di partenza per evidenziare la posizione quando sto iniziando la gara
		if (isRacing() && myTrailData.trailPoints.length === 0) {
			dispatch(
				setMyStartLanePosition(
					isPointInSegment(
						point,
						(trackData.startLane as StartLane).arrowPoints as Segment
					)
						? point
						: null
				)
			);
		}

		if (myTrailData.isMoving) {
			//rimuove il cerchio di posizione
			dispatch(setMyStartLanePosition(null));
			if (gameState === GameState.drawStartLane) {
				var pointAndDir = getPointAndDir(startLaneStartRef.current, point);
				dispatch(
					setStartLane(
						getStartLane(
							pointAndDir.direction,
							startLaneStartRef.current,
							trackData.grid
						)
					)
				);
			} else if (trackData.startLane && isRacing()) {
				let newTrailPoints: PathPoint[] = getMoveDetails(
					myTrailData.trailPoints,
					point,
					MoveStatus.moving,
					myTrailData.gear,
					trackData.startLane,
					trackData.grid,
					myTrailData.currentLap,
					trackData.raceLaps
				).points;
				dispatch(setMyTrailPoints(newTrailPoints));
			}
		}
	};

	let arrows: JSX.Element[] = [];
	let circles: (JSX.Element | never[])[] = [];
	let startCircle: JSX.Element;
	let opponentCircle: JSX.Element;
	let lines: (JSX.Element | never[])[] = [];

	if (myTrailData.startLanePosition) {
		let style: CSSProperties = {};
		style.stroke = "aqua";
		style.strokeWidth = 4;
		style.opacity = 1;
		startCircle = (
			<circle
				key={"startCircle"}
				cx={myTrailData.startLanePosition.x}
				cy={myTrailData.startLanePosition.y}
				r="4"
				style={style}
			/>
		);
	} else startCircle = <></>;

	if (opponentTrailData) {
		let style: CSSProperties = {};
		style.stroke = "white";
		style.strokeWidth = 2;
		style.opacity = 1;
		opponentCircle = (
			<circle
				key={"opponentCircle"}
				cx={opponentTrailData.trailPoint.x}
				cy={opponentTrailData.trailPoint.y}
				r="6"
				style={style}
			/>
		);
	} else opponentCircle = <></>;

	if (myTrailData.trailPoints.length > 0) {
		let filtered = myTrailData.trailPoints.filter(
			(point, i, points) => i >= points.length - TRAIL_LENGTH
		);
		circles = filtered.reverse().map(function (point, i, a) {
			if (i !== a.length - 1) {
				let style: CSSProperties = {};
				style.stroke = point.isCrash ? "tomato" : "aqua";
				style.strokeWidth = point.isCrash ? 3 : 2;
				style.opacity = i > 0 ? 1 / (i / 2) : 1;
				if (point.isCrash || point.isMoved)
					return (
						<circle
							key={"circle" + i}
							cx={point.x}
							cy={point.y}
							r="4"
							style={style}
						/>
					);
			}
			return [];
		});
		lines = filtered.map(function (point, i, points) {
			if (i > 0) {
				let style = {
					opacity: (TRAIL_LENGTH - i) / TRAIL_LENGTH,
					stroke: TRAIL_COLOR,
				};
				return (
					<line
						key={"line" + i}
						x1={point.x}
						y1={point.y}
						x2={points[i - 1].x}
						y2={points[i - 1].y}
						style={style}
					/>
				);
			}
			return [];
		});
	}
	if (trackData.startLane && trackData.startLane.arrows)
		arrows = trackData.startLane.arrows.map(function (arrow, i) {
			return <polyline key={i} id="line" points={arrow} />;
		});

	return (
		<StyledGrid dimensions={trackData.dimensions} bg={trackData.imgData}>
			<img
				alt="bg-path"
				src={trackData.imgData as string}
				width={trackData.dimensions.w}
				height={trackData.dimensions.h}
			/>
			<SvgBoard
				onSvgClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
					handleClick(e)
				}
				onSvgMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
					handleMove(e)
				}
				dimensions={trackData.dimensions}
				viewBox={"0 0 " + trackData.dimensions.w + " " + trackData.dimensions.h}
			>
				<g id="startLane">
					{arrows}
					{startCircle}
				</g>
				{opponentCircle}
				{circles}
				{lines}
			</SvgBoard>
		</StyledGrid>
	);
};
export default Grid;
