export interface Point {
	x: number;
	y: number;
}

export type Segment = Point[];

export interface StartLane {
	points?: Segment;
	arrowPoints?: Segment;
	directionOfTravel?: Direction;
	arrows?: string[];
	point1?: Point;
	point2?: Point;
}

export type Direction = "O" | "E" | "S" | "N" | "NE" | "NO" | "SE" | "SO" | "";
export type Gear = 0 | 1 | 2 | 3 | 4 | 5;

export type IGrid = Array<GridRow>;
export type GridRow = Array<GridValue>;
export type GridValue = 0 | 1 | 2;

export interface Move {
	point: Point;
	direction: Direction;
	gear: Gear;
}
export enum MoveStatus {
	start = "start",
	moving = "moving",
	moved = "moved",
}

export interface Dimensions {
	w: number;
	h: number;
}

export interface CrashInfo {
	lastGoodPoint?: Point;
	yesItIs: boolean;
}

export interface PathPoint {
	x: number;
	y: number;
	isCrash?: boolean;
	isMoved?: boolean;
}
