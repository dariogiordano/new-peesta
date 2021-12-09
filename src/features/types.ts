export interface Point {
	x: number;
	y: number;
}

export type Segment = Point[];

export interface StartLane {
	points: Segment | null;
	arrowPoints: Segment | null;
	directionOfTravel: Direction | null;
	arrows: string[] | null;
	point1: Point | null;
	point2: Point | null;
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

export interface PathPoint extends Point {
	isCrash?: boolean;
	isMoved?: boolean;
}

export interface MyTrailData {
	trailPoints: PathPoint[];
	gear: Gear;
	startLanePosition: Point | null;
	movesNumber: number;
	currentLap: number;
	isMoving: boolean;
}
export interface OpponentTrailData {
	trailPoint: PathPoint;
	//	direction: Direction;
}

export interface TrackData {
	dimensions: Dimensions;
	grid: IGrid;
	imgData: string | null;
	raceLaps: number;
	startLane: StartLane | null;
}
