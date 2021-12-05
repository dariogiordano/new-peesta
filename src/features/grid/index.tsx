import { CSSProperties } from "hoist-non-react-statics/node_modules/@types/react";
import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { CELL_SIZE, GameState, TRAIL_COLOR, TRAIL_LENGTH } from "../constants";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import {
	Dimensions,
	Direction,
	Gear,
	IGrid,
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
	selectCurrentLap,
	selectGear,
	selectGridData,
	selectIsmoving,
	selectRaceLaps,
	selectStartLane,
	selectStartLanePosition,
	selectStartLaneStart,
	selectTrailPoints,
	setAlertMsg,
	setCurrentLap,
	setGear,
	setIsMoving,
	setStartLane,
	setStartLanePosition,
	setStartLaneStart,
	setTrailPoints,
} from "./gridSlice";
import StyledGrid from "./styled";
import SvgBoard from "./svgBoard";

const Grid = () => {
	const raceLaps = useAppSelector(selectRaceLaps);
	const currentLap = useAppSelector(selectCurrentLap);
	const gameState: GameState = useAppSelector(selectGameState);
	const trailPoints = useAppSelector(selectTrailPoints);
	const isMoving = useAppSelector(selectIsmoving);
	const startLane = useAppSelector(selectStartLane) as StartLane;
	const startLaneStart = useAppSelector(selectStartLaneStart) as Point;
	const [dimensions, grid, bg] = useAppSelector(selectGridData);
	const gear = useAppSelector(selectGear) as Gear;
	const dispatch = useAppDispatch();
	const lastPointRef = useRef<Point>({ x: 0, y: 0 });
	const startLanePosition = useAppSelector(selectStartLanePosition);

	const navigate = useNavigate();
	const directionHistoryRef = useRef<Direction>("");
	useEffect(() => {
		if ((grid as IGrid).length === 0) navigate("/draw");
	});

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const point: Point = {
			x: Math.floor((e.clientX + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
			y: Math.floor((e.clientY + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
		};
		//disegno della start lane
		if (gameState === GameState.drawFinishLine) {
			if (!isMoving) {
				lastPointRef.current = point;

				if (getGridValue(point, grid as IGrid) === 1) {
					dispatch(setStartLane({}));
					dispatch(setStartLaneStart(point));
					dispatch(setIsMoving(true));
					dispatch(setAlertMsg(""));
				} else
					dispatch(
						setAlertMsg("click a point on the track to draw the start lane.")
					);
			} else if (isValidStartLane(startLane, grid as IGrid)) {
				dispatch(setIsMoving(false));
				dispatch(setAlertMsg(""));
			}
		} else if (gameState === GameState.running) {
			if (!isMoving) {
				//registro lastPoint per attivare il sistema che evita
				//la ripetizione dell'evento in caso di movimento
				//del mouse dentro la cella x,y
				lastPointRef.current = point;

				//segno il punto di partenza sulla linea di partenza

				if (
					isPointInSegment(point, startLane.arrowPoints as Segment) &&
					trailPoints.length === 0
				) {
					dispatch(setIsMoving(true));
					dispatch(setAlertMsg(""));
					dispatch(setTrailPoints([point]));
				} else if (trailPoints.length > 0) {
					dispatch(setIsMoving(true));
					dispatch(setAlertMsg(""));
					dispatch(
						setTrailPoints(
							getMoveDetails(
								trailPoints,
								point,
								MoveStatus.start,
								gear,
								startLane,
								grid as IGrid,
								currentLap,
								raceLaps
							).points
						)
					);
				} else {
					dispatch(setAlertMsg("Click on a point on start lane to start"));
				}
			} else {
				const moveDetails = getMoveDetails(
					trailPoints,
					point,
					MoveStatus.moved,
					gear,
					startLane,
					grid as IGrid,
					currentLap,
					raceLaps
				);
				/*
        if (moveDetails.points...
        points NON viene restituito da get Move Details in caso di ripartenza dopo un incidente verso un punto NON sulla pista 
        */
				if (
					moveDetails.points &&
					!isOutOfRange(moveDetails.points, dimensions as Dimensions) &&
					!isUTurn(
						moveDetails.direction,
						directionHistoryRef.current as Direction,
						startLane,
						gear,
						trailPoints
					) &&
					moveDetails.finishLineInfo !== "wrong direction"
				) {
					directionHistoryRef.current = moveDetails.direction;
					//setto un variabile locale per currentlap altrimenti se la gara finisce devo aspettare la mossa successiva per accorgermene
					let newCurrentLap = currentLap;
					if (moveDetails.finishLineInfo === "one lap less to go") {
						newCurrentLap += 1;
						dispatch(setCurrentLap(newCurrentLap));
					}

					dispatch(setIsMoving(false));
					dispatch(
						setAlertMsg(
							moveDetails.finishLineInfo === "incident at cut line"
								? "OMG! you crashed on finish line!!!"
								: ""
						)
					);
					dispatch(setTrailPoints(moveDetails.points));
					if (
						newCurrentLap === raceLaps + 1 &&
						moveDetails.finishLineInfo !== "incident at cut line"
					)
						dispatch(changeGameState(GameState.end));
					dispatch(setGear(moveDetails.isCrash ? 0 : moveDetails.gear));
				}
			}
		}
	};

	const handleMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const point: Point = {
			x: Math.floor((e.clientX + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
			y: Math.floor((e.clientY + CELL_SIZE / 2) / CELL_SIZE) * CELL_SIZE,
		};

		if (
			gameState === GameState.running &&
			trailPoints.length === 0 &&
			isPointInSegment(point, startLane.arrowPoints as Segment)
		) {
			dispatch(setStartLanePosition(point));
		} else {
			dispatch(setStartLanePosition(null));
		}

		if (
			isMoving &&
			!(
				e.clientX >= lastPointRef.current.x - CELL_SIZE / 2 &&
				e.clientX < lastPointRef.current.x + CELL_SIZE / 2 &&
				e.clientY >= lastPointRef.current.y - CELL_SIZE / 2 &&
				e.clientY < lastPointRef.current.y + CELL_SIZE / 2
			)
		) {
			lastPointRef.current = point;
			if (gameState === GameState.drawFinishLine) {
				var pointAndDir = getPointAndDir(startLaneStart, point);
				dispatch(
					setStartLane(
						getStartLane(pointAndDir.direction, startLaneStart, grid as IGrid)
					)
				);
			} else if (gameState === GameState.running) {
				if (
					isPointInSegment(point, startLane.arrowPoints as Segment) &&
					trailPoints.length === 0
				) {
					dispatch(setStartLanePosition(point));
				}

				let newTrailPoints: PathPoint[] = getMoveDetails(
					trailPoints,
					point,
					MoveStatus.moving,
					gear,
					startLane,
					grid as IGrid,
					currentLap,
					raceLaps
				).points;
				dispatch(setTrailPoints(newTrailPoints));
			}
		}
	};

	if (gameState === GameState.draw)
		dispatch(changeGameState(GameState.drawFinishLine));

	if (gameState === GameState.end) {
		dispatch(setAlertMsg(`hai impiegato ${trailPoints.length - 1} mosse`));
	}

	let arrows: JSX.Element[] = [];
	let circles: (JSX.Element | never[])[] = [];
	let startCircle: JSX.Element;
	let lines: (JSX.Element | never[])[] = [];

	if (startLanePosition) {
		let style: CSSProperties = {};
		style.stroke = "aqua";
		style.strokeWidth = 4;
		style.opacity = 1;
		startCircle = (
			<circle
				key={"startCircle"}
				cx={startLanePosition.x}
				cy={startLanePosition.y}
				r="4"
				style={style}
			/>
		);
	} else startCircle = <></>;

	if (trailPoints.length > 0) {
		let filtered = trailPoints.filter(
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
						//	pippo={TRAIL_LENGTH - (TRAIL_LENGTH - i)}
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
	if (startLane && startLane.arrows)
		arrows = startLane.arrows.map(function (arrow, i) {
			return <polyline key={i} id="line" points={arrow} />;
		});

	return (
		<StyledGrid
			dimensions={dimensions as Dimensions}
			bg={bg as string}
			onClick={(e) => handleClick(e)}
			onMouseMove={(e) => handleMove(e)}
		>
			<SvgBoard
				viewBox={
					"0 0 " +
					(dimensions as Dimensions).w +
					" " +
					(dimensions as Dimensions).h
				}
			>
				<g id="startLane">
					{arrows}
					{startCircle}
				</g>
				{circles}
				{lines}
			</SvgBoard>
		</StyledGrid>
	);
};
export default Grid;
