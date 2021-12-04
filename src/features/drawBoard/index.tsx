import React, { useRef, useLayoutEffect } from "react";
import StyledDrawBoard from "./styled";
import { BG_COLOR, CELL_SIZE, GameState, TRACK_COLOR } from "../constants";
import { useNavigate } from "react-router-dom";
import { Point } from "../types";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectColor, selectSize } from "./drawBoardSlice";

import { getGrid, rgbToHex } from "./drawBoardAPI";
import { changeGameState, selectGameState } from "../dashBoard/dashBoardSlice";
import { setGridData } from "../grid/gridSlice";

const DrawBoard = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dispatch = useAppDispatch();
	let mouse = useRef<Point>({ x: 0, y: 0 });
	let last_mouse = useRef<Point>({ x: 0, y: 0 });
	let down = useRef<Boolean>(false);
	const navigate = useNavigate();
	const width: number = window.innerWidth - 240;
	const height: number = window.innerHeight;
	const brushColor = useAppSelector(selectColor);
	const brushSize = useAppSelector(selectSize);
	const gameState = useAppSelector(selectGameState);

	useLayoutEffect(() => {
		let canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				if (gameState === GameState.start) {
					ctx.fillStyle = BG_COLOR;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					dispatch(changeGameState(GameState.draw));
				}
				ctx.lineWidth = brushSize;
				ctx.lineJoin = "round";
				ctx.lineCap = "round";
				ctx.strokeStyle = brushColor;
				if (gameState === GameState.drawFinishLine) {
					let gridPromise = getGrid(
						canvas,
						CELL_SIZE,

						height,
						width,
						BG_COLOR,
						ctx
					);
					gridPromise.then(function (result) {
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
						if (canvas) {
							dispatch(
								setGridData([
									{ w: width, h: height },
									result.grid,
									canvas.toDataURL(),
								])
							);
							navigate("/play");
						}
					});
				}
			}
		}
	});

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
		mouse.current.x = e.pageX;
		mouse.current.y = e.pageY;

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
				mouse.current.x = e.pageX;
				mouse.current.y = e.pageY;
			}
			if (down.current) onPaint(ctx);
		}
	};
	return (
		<StyledDrawBoard cursorSize={brushSize}>
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
