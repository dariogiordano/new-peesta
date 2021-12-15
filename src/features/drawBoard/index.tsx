import React, { useRef, useLayoutEffect } from "react";
import StyledDrawBoard from "./styled";
import { BG_COLOR, CELL_SIZE, GameState, TRACK_COLOR } from "../constants";
import { useNavigate } from "react-router-dom";
import { Point, TrackData } from "../types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	removeExternalDataUrl,
	selectColor,
	selectDataUrl,
	selectExternalDataUrl,
	selectSize,
	setDataUrl,
} from "./drawBoardSlice";

import { getGrid, hasNoInnerPoints, rgbToHex } from "./drawBoardAPI";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import { setTrackData, selectRaceLaps, setAlertMsg } from "../grid/gridSlice";
const width: number = document.documentElement.clientWidth * 0.8;
const height: number = document.documentElement.clientHeight;
const DrawBoard = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dispatch = useAppDispatch();
	let mouse = useRef<Point>({ x: 0, y: 0 });
	let last_mouse = useRef<Point>({ x: 0, y: 0 });
	let down = useRef<Boolean>(false);
	const navigate = useNavigate();
	const dataUrl = useAppSelector(selectDataUrl);
	const raceLaps = useAppSelector(selectRaceLaps);
	const brushColor = useAppSelector(selectColor);
	const brushSize = useAppSelector(selectSize);
	const gameState = useAppSelector(selectGameState);
	const externalDataURL = useAppSelector(selectExternalDataUrl);
	useLayoutEffect(() => {
		let canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				if (gameState === GameState.start) {
					ctx.fillStyle = BG_COLOR;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					dispatch(setDataUrl(null));
					addBorder(ctx, canvas.width, canvas.height);
					dispatch(changeGameState(GameState.draw));
				} else if (dataUrl) {
					let img = new Image();
					img.src = dataUrl;
					setTimeout(() => {
						ctx.drawImage(img, 0, 0);
						if (canvas) addBorder(ctx, canvas.width, canvas.height);
						ctx.lineWidth = brushSize;
						ctx.lineJoin = "round";
						ctx.lineCap = "round";
						ctx.strokeStyle = brushColor;
					});
				} else if (externalDataURL) {
					let img = new Image();
					img.src = externalDataURL;
					setTimeout(() => {
						ctx.drawImage(img, 0, 0);
						if (canvas) addBorder(ctx, canvas.width, canvas.height);
						dispatch(removeExternalDataUrl());
					});
				}

				ctx.lineWidth = brushSize;
				ctx.lineJoin = "round";
				ctx.lineCap = "round";
				ctx.strokeStyle = brushColor;
				if (gameState === GameState.drawFinishLine) {
					deleteBorder(ctx, width, height);
					let gridPromise = getGrid(
						canvas,
						CELL_SIZE,
						height,
						width,
						BG_COLOR,
						ctx
					);
					gridPromise.then(function (result) {
						//check se la pista è disegnata bene, per farlo controllo se nella grid creata ci sono dei 2
						if (hasNoInnerPoints(result.grid)) {
							addBorder(ctx, width, height);
							dispatch(
								setAlertMsg(
									"Your track is not valid. Please draw a loop (whitin the red borders!)"
								)
							);
							dispatch(changeGameState(GameState.draw));
						} else {
							dispatch(setAlertMsg(""));
							for (let w = CELL_SIZE; w < width; w += CELL_SIZE) {
								for (let h = CELL_SIZE; h < height; h += CELL_SIZE) {
									let p = ctx.getImageData(w, h, 1, 1).data;
									let hex: string | null =
										"#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

									if (hex === TRACK_COLOR) {
										ctx.fillStyle = "#f0f0f0";
										ctx.fillRect(w, h, 1, 1);
									} else {
										ctx.fillStyle = "#222222";
										ctx.fillRect(w, h, 1, 1);
									}
								}
							}

							const newTrackData: TrackData = {
								dimensions: { w: width, h: height },
								grid: result.grid,
								imgData: (canvas as HTMLCanvasElement).toDataURL(),
								raceLaps,
								startLane: null,
							};
							dispatch(setTrackData(newTrackData));
							navigate("/play");
						}
					});
				}
			}
		}
	});

	const deleteBorder = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	) => {
		//DELETE BORDER
		ctx.beginPath();
		ctx.lineWidth = CELL_SIZE * 2 + CELL_SIZE / 2;
		ctx.strokeStyle = BG_COLOR;
		ctx.moveTo(0, 0);
		ctx.lineTo(width, 0);
		ctx.lineTo(width, height);
		ctx.lineTo(0, height);
		ctx.lineTo(0, 0);
		ctx.closePath();
		ctx.stroke();
	};
	const addBorder = (
		ctx: CanvasRenderingContext2D,
		width: number,
		height: number
	) => {
		ctx.lineWidth = 1;
		const border: number = CELL_SIZE;
		ctx.beginPath();
		ctx.strokeStyle = "red";
		ctx.setLineDash([4, 8]);
		ctx.moveTo(border, border);
		ctx.lineTo(width - border, border);
		ctx.lineTo(width - border, height - border);
		ctx.lineTo(border, height - border);
		ctx.lineTo(border, border);
		ctx.closePath();
		ctx.stroke();
		ctx.setLineDash([]);
	};

	const onPaint = (ctx: CanvasRenderingContext2D | null) => {
		if (ctx) {
			ctx.beginPath();
			ctx.moveTo(last_mouse.current.x, last_mouse.current.y);
			ctx.lineTo(mouse.current.x, mouse.current.y);
			ctx.closePath();
			ctx.stroke();
		}
	};

	const handleMouseDown = (
		e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		mouse.current.x = e.clientX - e.currentTarget.getBoundingClientRect().left;
		mouse.current.y = e.clientY - e.currentTarget.getBoundingClientRect().top;

		if (!e.shiftKey || mouse.current.x === undefined) {
			last_mouse.current.x = mouse.current.x;
			last_mouse.current.y = mouse.current.y;
		}
		if (!e.shiftKey) {
			down.current = true;
		}
		let canvas = canvasRef.current;
		let ctx: CanvasRenderingContext2D | null;
		if (canvas) {
			ctx = canvas.getContext("2d");
			onPaint(ctx);
		}
	};
	const handleMouseUp = (
		e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		last_mouse.current.x = mouse.current.x;
		last_mouse.current.y = mouse.current.y;
		down.current = false;
		updateDataUrl();
	};

	const updateDataUrl = () => {
		let canvas = canvasRef.current as HTMLCanvasElement;
		let canvasToDownload = document.createElement(
			"CANVAS"
		) as HTMLCanvasElement;
		let img = new Image();
		img.src = canvas.toDataURL();
		let ctx = canvasToDownload.getContext("2d") as CanvasRenderingContext2D;
		canvasToDownload.width = canvas.width;
		canvasToDownload.height = canvas.height;
		setTimeout(() => {
			ctx.drawImage(img, 0, 0);
			deleteBorder(ctx, canvas.width, canvas.height);
			dispatch(setDataUrl(canvasToDownload.toDataURL()));
		});
	};

	const handleMouseMove = (
		e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
	) => {
		let canvas = canvasRef.current;
		let ctx: CanvasRenderingContext2D | null;
		if (canvas) {
			ctx = canvas.getContext("2d");

			if (!e.shiftKey && down.current) {
				last_mouse.current.x = mouse.current.x;
				last_mouse.current.y = mouse.current.y;
				mouse.current.x =
					e.clientX - e.currentTarget.getBoundingClientRect().left;
				mouse.current.y =
					e.clientY - e.currentTarget.getBoundingClientRect().top;
			}
			if (down.current) onPaint(ctx);
		}
	};
	return (
		<StyledDrawBoard cursorSize={brushSize} cWidth={width} cHeight={height}>
			<canvas
				ref={canvasRef}
				onMouseDown={(e) => handleMouseDown(e)}
				onMouseUp={(e) => handleMouseUp(e)}
				onMouseMove={(e) => handleMouseMove(e)}
				width={width}
				height={height}
			>
				cannot display canvas
			</canvas>
		</StyledDrawBoard>
	);
};

export default DrawBoard;
