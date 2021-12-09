import { CELL_SIZE, GEAR_MAX, MAX_OFFROAD_LENGTH } from "../constants";
import {
	CrashInfo,
	Direction,
	Gear,
	IGrid,
	GridValue,
	Move,
	MoveStatus,
	PathPoint,
	Point,
	Segment,
	StartLane,
	Dimensions,
} from "../types";

export function checkCutFinishLine(
	move: Move,
	startLane: StartLane,
	trailPoints: PathPoint[]
): string {
	var slPoints: Segment = startLane.points as Segment;
	var slDirection: Direction = startLane.directionOfTravel as Direction;

	var points: Segment = getPointsOfSegment(move).reverse();
	var intersections: boolean[] = points.map((point: Point) =>
		isPointInSegment(point, slPoints)
	);
	var EIntersections: boolean[] = points
		.map((point: Point) => {
			return { x: point.x - CELL_SIZE, y: point.y };
		})
		.map((point: Point) => isPointInSegment(point, slPoints));
	var OIntersections: boolean[] = points
		.map((point) => {
			return { x: point.x + CELL_SIZE, y: point.y };
		})
		.map((point) => isPointInSegment(point, slPoints));
	var joinedIntersections = [];
	switch (slDirection) {
		case "O":
		case "S":
		case "N":
		case "E":
			if (
				intersections.filter((int) => int === true).length === 0 ||
				trailPoints.length <= 2
			)
				return "no cut";
			if (
				intersections.filter((int) => int === true).length >= 1 &&
				!isFinishLineDirection(move.direction, startLane)
			)
				return "wrong direction";
			if (
				intersections.filter((int) => int === true).length === 1 &&
				intersections.indexOf(true) > 0
			)
				return "one lap less to go";
			return "no cut";
		case "SE":
		case "NE":
		case "SO":
		case "NO":
			if (
				(intersections.filter((int) => int === true).length === 0 &&
					EIntersections.filter((int) => int === true).length === 0 &&
					OIntersections.filter((int) => int === true).length === 0) ||
				trailPoints.length <= 2
			)
				return "no cut";

			if (isFinishLineDirection(move.direction, startLane)) {
				var secondIntersection =
					slDirection === "SE" || slDirection === "NE"
						? OIntersections
						: EIntersections;
				if (
					(intersections.filter((int) => int === true).length === 1 &&
						intersections.indexOf(true) > 0) ||
					(secondIntersection.filter((int) => int === true).length === 1 &&
						secondIntersection.indexOf(true) > 0 &&
						intersections[0] !== true) //verifico che la partenza del giro successivo non avvenga esattamente dalla linea di partenza
				)
					return "one lap less to go";
			} else {
				joinedIntersections =
					slDirection === "SE" || slDirection === "NE"
						? [...intersections, ...EIntersections]
						: [...intersections, ...OIntersections];
				if (joinedIntersections.filter((int) => int === true).length >= 1)
					return "wrong direction";
			}
			return "no cut";
		default:
			return "no cut";
	}
}

export function isFinishLineDirection(dir: Direction, startLane: StartLane) {
	switch (startLane.directionOfTravel) {
		case "O":
			return !(dir === "SE" || dir === "E" || dir === "NE");
		case "NO":
			return !(dir === "S" || dir === "SE" || dir === "E");
		case "N":
			return !(dir === "SO" || dir === "S" || dir === "SE");
		case "NE":
			return !(dir === "O" || dir === "SO" || dir === "S");
		case "E":
			return !(dir === "NO" || dir === "O" || dir === "SO");
		case "SE":
			return !(dir === "N" || dir === "NO" || dir === "O");
		case "S":
			return !(dir === "NE" || dir === "N" || dir === "NO");
		case "SO":
			return !(dir === "E" || dir === "NE" || dir === "N");
		default:
			return false;
	}
}

export function isUTurn(
	lastDirection: Direction,
	directionHistory: Direction,
	startLane: StartLane,
	currentGear: Gear,
	trailPoints: PathPoint[]
) {
	// siamo a inizio gara: in questo caso possiamo andare solo nel senso di marcia
	if (trailPoints.length === 2) {
		let dir = startLane.directionOfTravel;
		switch (lastDirection) {
			case "O":
				return !(dir === "NO" || dir === "O" || dir === "SO");
			case "NO":
				return !(dir === "N" || dir === "NO" || dir === "O");
			case "N":
				return !(dir === "NE" || dir === "N" || dir === "NO");
			case "NE":
				return !(dir === "E" || dir === "NE" || dir === "N");
			case "E":
				return !(dir === "SE" || dir === "E" || dir === "NE");
			case "SE":
				return !(dir === "S" || dir === "SE" || dir === "E");
			case "S":
				return !(dir === "SO" || dir === "S" || dir === "SE");
			case "SO":
				return !(dir === "O" || dir === "SO" || dir === "S");
			default:
				return false;
		}
	}
	// siamo dopo un incidente (gear=0): in questo caso possiamo andare dove vogliamo
	if (currentGear === 0) return false;
	//caso di mossa normale
	switch (lastDirection) {
		case "O":
			return directionHistory === "E";
		case "NO":
			return directionHistory === "SE";
		case "N":
			return directionHistory === "S";
		case "NE":
			return directionHistory === "SO";
		case "E":
			return directionHistory === "O";
		case "SE":
			return directionHistory === "NO";
		case "S":
			return directionHistory === "N";
		case "SO":
			return directionHistory === "NE";
		default:
			return false;
	}
}

export function isOutOfRange(points: Segment, dimensions: Dimensions) {
	var point: Point = points[points.length - 1];
	if (point)
		return (
			point.x < CELL_SIZE ||
			point.x > dimensions.w ||
			point.y < CELL_SIZE ||
			point.y > dimensions.h
		);
	else return true;
}

export function getPointsOfSegment(move: Move): Segment {
	let points: Segment = [];
	for (var i = 0; i <= move.gear; i++) {
		let pointToCheck: Point = getNewPointFromGear(
			move.point,
			move.direction,
			i
		);
		points.push(pointToCheck);
	}
	return points;
}

export function getGridValuesOfSegment(
	move: Move,

	grid: IGrid
): GridValue[] {
	let points: Segment = getPointsOfSegment(move);
	return points.map((point: Point) => getGridValue(point, grid));
}

export function getGear(point1: Point, point2: Point): Gear {
	var ipo = Math.sqrt(
		Math.pow(Math.abs(point1.x - point2.x), 2) +
			Math.pow(Math.abs(point1.y - point2.y), 2)
	);
	const diagonale = Math.sqrt(Math.pow(CELL_SIZE, 2) + Math.pow(CELL_SIZE, 2));
	var gear = 0;
	if (Math.abs(point1.x - point2.x) === Math.abs(point1.y - point2.y))
		gear = Math.round(ipo / diagonale);
	else gear = Math.round(ipo / CELL_SIZE);
	return gear as Gear;
}

export function getPointAndDir(
	prevPoint: Point,
	actualPoint: Point
): { point: Point; direction: Direction } {
	let newPoint: Point = { ...actualPoint };
	let direction: Direction;
	//trovo la lungezza e il coseno e l'angolo
	var ipo = Math.sqrt(
		Math.pow(actualPoint.x - prevPoint.x, 2) +
			Math.pow(actualPoint.y - prevPoint.y, 2)
	);
	var cos = (actualPoint.x - prevPoint.x) / ipo;
	var angle = (Math.acos(cos) * 180) / Math.PI;
	//con l'angolo trovo la direzione e la posizione del mouse dicretizzata ogni 45 gradi
	if (angle <= 22.5 || angle >= 157.5) {
		newPoint.y = prevPoint.y;
		direction = angle <= 22.5 ? "O" : "E";
	} else if (actualPoint.y - prevPoint.y < 0) {
		if (angle < 45) {
			newPoint.x = prevPoint.x - (actualPoint.y - prevPoint.y);
			direction = "NO";
		} else if (angle < 67.5) {
			newPoint.y = prevPoint.y - (actualPoint.x - prevPoint.x);
			direction = "NO";
		} else if (angle < 112.5) {
			newPoint.x = prevPoint.x;
			direction = "N";
		} else if (angle < 135) {
			newPoint.y = prevPoint.y - (prevPoint.x - actualPoint.x);
			direction = "NE";
		} else {
			newPoint.x = prevPoint.x - (prevPoint.y - actualPoint.y);
			direction = "NE";
		}
	} else {
		if (angle < 45) {
			newPoint.x = prevPoint.x - (prevPoint.y - actualPoint.y);
			direction = "SO";
		} else if (angle < 67.5) {
			newPoint.y = prevPoint.y - (prevPoint.x - actualPoint.x);
			direction = "SO";
		} else if (angle < 112.5) {
			newPoint.x = prevPoint.x;
			direction = "S";
		} else if (angle < 135) {
			newPoint.y = prevPoint.y - (actualPoint.x - prevPoint.x);
			direction = "SE";
		} else {
			newPoint.x = prevPoint.x - (actualPoint.y - prevPoint.y);
			direction = "SE";
		}
	}
	return { point: newPoint, direction };
}

export function getMoveDetails(
	trailPoints: PathPoint[],
	point: Point,
	status: MoveStatus,
	currentGear: Gear,
	startLane: StartLane,
	grid: IGrid,
	currentLap: number,
	raceLaps: number
) {
	//creo una copia privata dei points attuali
	let points = [...trailPoints];
	//se mi sto muovendo rimuovo l'ultimo valore prima di metterne uno nuovo
	if (points.length > 1 && status === MoveStatus.moving)
		points = points.filter((x, i, a) => i !== a.length - 1);
	//cerco il punto di partenza del segmento
	var startPoint: Point = points[points.length - 1];
	//se la mossa è finita, prendo gli ultimi due punti inseriti, altrimenti considero la x e y passatemi dall'evento per valutare l'ultimo punto

	if (status === MoveStatus.moved) {
		startPoint = points[points.length - 2];
		point.x = points[points.length - 1].x;
		point.y = points[points.length - 1].y;
	}

	var pointAndDir = getPointAndDir(startPoint, point);
	let newPoint = pointAndDir.point;
	var direction = pointAndDir.direction;
	//segmentToChangeGear è la marcia corrispondente al segmento teso tra l'ultimo punto inserito e la posizione del mouse discretizzata appena calcolata
	var segmentToChangeGear: Gear = getGear(newPoint, startPoint);
	// se la marcia è minore o maggiore del consensito forzo la lunghezza in base alla marcia e alla posizione discretizzata del mouse
	if (
		segmentToChangeGear - 1 > currentGear ||
		segmentToChangeGear + 1 < currentGear ||
		segmentToChangeGear > GEAR_MAX
	) {
		var movement: number = 0;
		if (segmentToChangeGear - 1 > currentGear && currentGear < GEAR_MAX)
			movement = (currentGear + 1) * CELL_SIZE;
		else if (segmentToChangeGear + 1 < currentGear)
			movement = (currentGear - 1) * CELL_SIZE;
		else movement = CELL_SIZE * GEAR_MAX;

		switch (direction) {
			case "O":
				newPoint.x = startPoint.x + movement;
				break;
			case "NO":
				newPoint.x = startPoint.x + movement;
				newPoint.y = startPoint.y - movement;
				break;
			case "N":
				newPoint.y = startPoint.y - movement;
				break;
			case "NE":
				newPoint.x = startPoint.x - movement;
				newPoint.y = startPoint.y - movement;
				break;
			case "E":
				newPoint.x = startPoint.x - movement;
				break;
			case "SE":
				newPoint.x = startPoint.x - movement;
				newPoint.y = startPoint.y + movement;
				break;
			case "S":
				newPoint.y = startPoint.y + movement;
				break;
			case "SO":
				newPoint.x = startPoint.x + movement;
				newPoint.y = startPoint.y + movement;
				break;
			default:
				break;
		}
	}

	var gear: Gear = getGear(startPoint, newPoint);
	let move: Move = {
		point: newPoint,
		direction,
		gear,
	};
	var crashInfo: CrashInfo = getCrashInfo(move, grid),
		finishLineInfo = checkCutFinishLine(move, startLane, trailPoints);
	//se c'è un last good point vuold dire che l'incidente è avvenuto e non è una ripartenza da un incidente
	if (status === "moved" && crashInfo.yesItIs && crashInfo.lastGoodPoint) {
		points = points.filter((p, i) => i < points.length - 1);
		if (finishLineInfo === "one lap less to go" && currentLap === raceLaps) {
			let newPoint: PathPoint = {
				x: points[points.length - 1].x,
				y: points[points.length - 1].y,
				isCrash: true,
			};
			points = points.filter((point, i, a) => i !== a.length - 1);
			points.push(newPoint);
			finishLineInfo = "incident at cut line";
		} else
			points.push({
				x: crashInfo.lastGoodPoint.x,
				y: crashInfo.lastGoodPoint.y,
				isCrash: true,
			});
	} else if (
		status === "moved" &&
		crashInfo.yesItIs &&
		!crashInfo.lastGoodPoint
	) {
		points = [];
	} else if (status === "moved") {
		let newPoint: PathPoint = {
			x: points[points.length - 1].x,
			y: points[points.length - 1].y,
			isMoved: true,
		};
		points = points.filter((point, i, a) => i !== a.length - 1);
		points.push(newPoint);
	} else points.push({ x: newPoint.x, y: newPoint.y });
	//resituisco i punti passati dalla discretizzazione e la direzione di marcia
	return {
		points,
		direction,
		gear,
		isCrash: crashInfo.yesItIs,
		finishLineInfo,
	};
}
/*
const newgetMoveDetails=(x,y,status)=>{
    //creo una copia privata dei points attuali
    let points=[...this.state.points];
    //se mi sto muovendo rimuovo l'ultimo valore prima di metterne uno nuovo
   
    if(points.length>1 && status==="moving")
      points=points.filter((x,i,a)=>i!==a.length-1);
    //cerco il punto di partenza del segmento
    var startPoint=points[points.length-1];
    //se la mossa è finita, prendo gli ultimi due punti inseriti, altrimenti considero la x e y passatemi dall'evento per valutare l'ultimo punto
    if(status==="moved"){
      startPoint=points[points.length-2];
      x=points[points.length-1].x;
      y=points[points.length-1].y;
    }
    var prevX= startPoint.x, prevY= startPoint.y;
    var pointAndDir=this.getPointAndDir(prevX,x,prevY,y);
    var newX=pointAndDir.point[0];
    var newY=pointAndDir.point[1];
    var direction=pointAndDir.direction;
    //segmentToChangeGear è la marcia corrispondente al segmento teso tra l'ultimo punto inserito e la posizione del mouse discretizzata appena calcolata
    var segmentToChangeGear=this.getGear(newX,newY,prevX,prevY);
    // se la marcia è minore o maggiore del consensito forzo la lunghezza in base alla marcia e alla posizione discretizzata del mouse
    if(segmentToChangeGear-1>this.state.gear || segmentToChangeGear+1<this.state.gear || segmentToChangeGear>this.gearMax){
      var movement=0;
      if(segmentToChangeGear-1>this.state.gear && this.state.gear<this.gearMax)
        movement=parseInt((this.state.gear+1)*this.cellSize);
      else if(segmentToChangeGear+1<this.state.gear)
        movement=parseInt((this.state.gear-1)*this.cellSize);
      else movement=this.cellSize*this.gearMax;
      prevX=parseInt(prevX);
      prevY=parseInt(prevY);
      switch (direction){
        case "O":
          newX=prevX+movement;
          break;
        case "NO":
          newX=prevX+movement;
          newY=prevY-movement;
          break;
        case "N":
          newY=prevY-movement;
          break;
        case "NE":
          newX=prevX-movement;
          newY=prevY-movement;
          break;
        case "E":
          newX=prevX-movement;
          break;
        case "SE":
          newX=prevX-movement;
          newY=prevY+movement;
          break;
        case "S":
          newY=prevY+movement;
          break;
        case "SO":
          newX=prevX+movement;
          newY=prevY+movement;
          break;
        default:
          break;
      }
    }
    var gear=this.getGear(prevX,prevY,newX,newY),
    crashInfo=this.getCrashInfo(newX,newY,direction,gear),
    finishLineInfo=this.checkCutFinishLine(newX,newY,direction,gear);
    //se c'è un last good point vuold ire che l'incidente è avvenuto e non è una ripartenza da un incidente
    if(status==="moved" && crashInfo.yesItIs && crashInfo.lastGoodPoint){
      points=points.filter((p,i)=>i<points.length-1);
      if(finishLineInfo==="one lap less to go" && this.currentLap===this.state.raceLaps-1){
        points[points.length-1].isCrash=true; 
        finishLineInfo="incident at cut line"
      }else points.push({x:crashInfo.lastGoodPoint[0],y:crashInfo.lastGoodPoint[1],isCrash:true});

    }else if(status==="moved" && crashInfo.yesItIs && !crashInfo.lastGoodPoint){
      points=null;  
    }
    else if(status==="moved"){
      points[points.length-1].isMoved=true;  
    }
    else if(status!=="moved")
      points.push({x:newX,y:newY});
    //resituisco i punti passati dalla discretizzazione e la direzione di marcia
    return {points,direction,gear,isCrash:crashInfo.yesItIs,finishLineInfo};
  }*/

export function getOppositeDirection(dir: Direction): Direction {
	switch (dir) {
		case "O":
			return "E";
		case "NO":
			return "SE";
		case "N":
			return "S";
		case "NE":
			return "SO";
		case "E":
			return "O";
		case "SE":
			return "NO";
		case "S":
			return "N";
		case "SO":
			return "NE";
		default:
			return dir;
	}
}

export function getPerpendicularDirection(dir: Direction) {
	switch (dir) {
		case "O":
			return "N";
		case "NO":
			return "NE";
		case "N":
			return "E";
		case "NE":
			return "SE";
		case "E":
			return "S";
		case "SE":
			return "SO";
		case "S":
			return "O";
		case "SO":
			return "NO";
		default:
			return dir;
	}
}

export function getArrowFromPoint(point: Point, direction: Direction) {
	var x1 = point.x,
		y1 = point.y,
		x2 = point.x,
		y2 = point.y,
		x3 = point.x,
		y3 = point.y;
	var size = Math.ceil(CELL_SIZE / 4);
	switch (direction) {
		case "O":
			x1 -= size;
			y2 -= size;
			x3 += size;
			break;
		case "NO":
			x1 += size;
			y1 -= size;
			x2 -= size;
			y2 -= size;
			x3 -= size;
			y3 += size;
			break;
		case "N":
			y1 -= size;
			x2 -= size;
			y3 += size;
			break;
		case "NE":
			x1 += size;
			y1 += size;
			x2 -= size;
			y2 += size;
			x3 -= size;
			y3 -= size;
			break;
		case "E":
			x1 -= size;
			y2 += size;
			x3 += size;
			break;
		case "SE":
			x1 += size;
			y1 -= size;
			x2 += size;
			y2 += size;
			x3 -= size;
			y3 += size;
			break;
		case "S":
			y1 -= size;
			x2 += size;
			y3 += size;
			break;
		case "SO":
			x1 -= size;
			y1 -= size;
			x2 += size;
			y2 -= size;
			x3 += size;
			y3 += size;
			break;
		default:
			break;
	}
	return x1 + "," + y1 + " " + x2 + "," + y2 + " " + x3 + "," + y3 + " ";
}

export function getStartLane(
	direction: Direction,
	startLaneStart: Point,
	grid: IGrid
): StartLane {
	var directionCohords = isTrackRecursive(startLaneStart, direction, 1, grid);
	var oppositeDirection = getOppositeDirection(direction);
	var oppositeDirectionCohords = isTrackRecursive(
		startLaneStart,
		oppositeDirection,
		1,
		grid
	);

	var gear = getGear(
		directionCohords as Point,
		oppositeDirectionCohords as Point
	);

	var points: Segment = getPointsOfSegment({
		point: oppositeDirectionCohords as Point,
		gear,
		direction,
	});

	var arrowPoints: Segment = points.filter(
		(point, i) => i > 0 && i < points.length - 1
	);
	var arrows = arrowPoints.map((point) => {
		return getArrowFromPoint(point, direction);
	});
	return {
		point1: directionCohords as Point,
		point2: oppositeDirectionCohords as Point,
		arrowPoints,
		points,
		arrows,
		directionOfTravel: getPerpendicularDirection(direction),
	};
}

export function isTrackRecursive(
	point: Point,
	direction: Direction,
	i: number,
	grid: IGrid
): Point | typeof isTrackRecursive {
	var p = getNewPointFromGear(point, direction, i);
	var pValue =
		grid[(p.y - CELL_SIZE) / CELL_SIZE][(p.x - CELL_SIZE) / CELL_SIZE];
	if (pValue === 0 || pValue === 2) {
		return p;
	} else {
		i++;
		return isTrackRecursive(point, direction, i, grid);
	}
}

export function isValidStartLane(startLane: StartLane, grid: IGrid) {
	let valuesArray = [
		getGridValue(startLane.point1 as Point, grid),
		getGridValue(startLane.point2 as Point, grid),
	];
	return (
		Object.keys(startLane).length > 0 &&
		valuesArray.indexOf(0) >= 0 &&
		valuesArray.indexOf(2) >= 0
	);
}

export function isPointInSegment(point: Point, segment: Segment) {
	for (var i = 0; i <= segment.length - 1; i++) {
		if (segment[i].x === point.x && segment[i].y === point.y) return true; // Found it
	}
	return false; // Not found
}

export function getNewPointFromGear(
	point: Point,
	direction: Direction,
	distance: number
): Point {
	let newX: number;
	let newY: number;
	let x: number = point.x;
	let y: number = point.y;
	let size = CELL_SIZE * distance;
	switch (direction) {
		case "O":
			newX = x - size;
			newY = y;
			break;
		case "NO":
			newX = x - size;
			newY = y + size;
			break;
		case "N":
			newX = x;
			newY = y + size;
			break;
		case "NE":
			newX = x + size;
			newY = y + size;
			break;
		case "E":
			newX = x + size;
			newY = y;
			break;
		case "SE":
			newX = x + size;
			newY = y - size;
			break;
		case "S":
			newX = x;
			newY = y - size;
			break;
		case "SO":
			newX = x - size;
			newY = y - size;
			break;
		default:
			newX = x;
			newY = y;
	}
	return { x: newX, y: newY };
}

export function getGridValue(point: Point, grid: IGrid): GridValue {
	if (
		Math.round(point.y / CELL_SIZE) - 1 > 0 &&
		Math.round(point.x / CELL_SIZE) - 1 > 0
	)
		return grid[Math.round(point.y / CELL_SIZE) - 1][
			Math.round(point.x / CELL_SIZE) - 1
		];
	else return 0;
}

export function getCrashInfo(move: Move, grid: IGrid): CrashInfo {
	let points: Segment = getPointsOfSegment(move);
	let gridValues: GridValue[] = getGridValuesOfSegment(move, grid);
	let redPoints = gridValues.filter((point) => point !== 1);
	let lastGoodPoint;
	/*se non trovo mai il colore della pista,
vuol dire che sto partendo dallo sfondo verso lo sfondo.
quindi non valorizzo il punto di ripartenza per bloccare la mossa */
	if (gridValues.indexOf(1) !== -1) {
		let index =
			gridValues.lastIndexOf(0) !== -1
				? gridValues.lastIndexOf(0)
				: gridValues.lastIndexOf(2);
		lastGoodPoint = points[index];
	}
	return {
		yesItIs:
			move.gear > 0 &&
			(redPoints.length > MAX_OFFROAD_LENGTH || gridValues[0] !== 1),
		lastGoodPoint,
	};
}
