import { IGrid, GridRow } from "../types";

export function rgbToHex(r: number, g: number, b: number) {
	return ((r << 16) | (g << 8) | b).toString(16);
}

export function recursiveCleanGrid(
	grid: IGrid
): IGrid | typeof recursiveCleanGrid {
	var needOneMore: boolean = false;
	grid.forEach((row: GridRow, indexV: number) => {
		row.forEach((cell, indexH) => {
			if (cell === 2) {
				//ovest
				if (indexH > 0 && row[indexH - 1] === 0) {
					needOneMore = true;
					for (let o = indexH; o <= row.length - 1; o++) {
						if (row[o] === 2) row.splice(o, 1, 0);
						else break;
					}
				}
				//est
				if (indexH < row.length - 1 && row[indexH + 1] === 0) {
					needOneMore = true;
					for (let e = indexH; e > 0; e--) {
						if (row[e] === 2) row.splice(e, 1, 0);
						else break;
					}
				}
				//sud
				if (indexV > 0 && grid[indexV - 1][indexH] === 0) {
					needOneMore = true;
					for (let s = indexV; s <= grid.length - 1; s++) {
						if (grid[s][indexH] === 2) grid[s].splice(indexH, 1, 0);
						else break;
					}
				}
				//nord
				if (indexV < grid.length - 1 && grid[indexV + 1][indexH] === 0) {
					needOneMore = true;
					for (let n = indexV; n > 0; n--) {
						if (grid[n][indexH] === 2) grid[n].splice(indexH, 1, 0);
						else break;
					}
				}
			}
		});
	});
	if (needOneMore) return recursiveCleanGrid(grid);
	else return grid;
}

export function getGrid(
	canvas: any,
	cellSize: number,
	height: number,
	width: number,
	bgColor: string,
	ctx: any
): Promise<{ grid: IGrid }> {
	return new Promise((resolve, reject) => {
		let grid: IGrid = [];

		for (var y = cellSize; y < height; y += cellSize) {
			let row: GridRow = [];
			for (var x = cellSize; x < width; x += cellSize) {
				let p = ctx.getImageData(x, y, 1, 1).data;
				let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
				row.push(hex !== bgColor ? 1 : 0);
			}
			grid.push(row);
		}
		//trovo tutti i punti della griglia interni alla pista
		grid = grid.map((row, indexV) => {
			row = row.map((cell, indexH) => {
				if (cell === 0) {
					var counterN = 0;
					var counterS = 0;
					var counterE = 0;
					var counterO = 0;
					for (let n = 0; n < indexV; n++) {
						if (grid[n][indexH] === 1) counterN++;
					}
					for (let s = indexV; s <= grid.length - 1; s++) {
						if (grid[s][indexH] === 1) counterS++;
					}
					for (let e = 0; e <= indexH; e++) {
						if (row[e] === 1) counterE++;
					}
					for (let o = indexH; o <= row.length - 1; o++) {
						if (row[o] === 1) counterO++;
					}
					if (counterN > 0 && counterS > 0 && counterE > 0 && counterO > 0) {
						return 2;
					}
				}
				return cell;
			});
			return row;
		});

		//elimino eventuali 2 lasciati nei sottosquadra fuori dalla pista nel passaggio precedente

		grid = recursiveCleanGrid(grid) as IGrid;
		resolve({ grid });
	});
}
