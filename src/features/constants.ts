export const CELL_SIZE = 20;
export const GEAR_MAX = 6;
export const TRACK_COLOR = "#303740";
export const TRAIL_COLOR = "#fffff";
export const BG_COLOR = "#11914d";
//per l'opacità della coda
export const TRAIL_LENGTH = 10;
/** numero massimo di punti fuori dalla pista attraversabili
 * per tagliare mai 0 perchè si rompe la ripartenza dopo un incidente
 * */
export const MAX_OFFROAD_LENGTH = 1;
export enum GameState {
	start = "start",
	draw = "draw",
	drawFinishLine = "drawFinishLine",
	raceStart = "raceStart",
	trainingStart = "trainingStart",
	raceEnd = "raceEnd",
	trainingEnd = "trainingEnd",
}

export enum RaceState {
	start = "start",
	waitingOpponentStart = "waitingOpponentStart",
	waitingOpponentMove = "waitingOpponentMove",
	moving = "makingMove",
	moved = "moved",
	won = "won",
	lost = "lost",
}