import { IGrid, GridRow, GridValue } from "../types";

export function rgbToHex(r: number, g: number, b: number) {
	return ((r << 16) | (g << 8) | b).toString(16);
}

export function recursiveCleanGrid(
	grid: IGrid
): IGrid | typeof recursiveCleanGrid {
	var needOneMore: boolean = false;
	grid.forEach((row: GridRow, indexV: number) => {
		row.forEach((cell, indexH) => {
			if (cell === GridValue.inner) {
				//ovest
				if (indexH > 0 && row[indexH - 1] === GridValue.outer) {
					needOneMore = true;
					for (let o = indexH; o <= row.length - 1; o++) {
						if (row[o] === GridValue.inner) row.splice(o, 1, GridValue.outer);
						else break;
					}
				}
				//est
				if (indexH < row.length - 1 && row[indexH + 1] === GridValue.outer) {
					needOneMore = true;
					for (let e = indexH; e > 0; e--) {
						if (row[e] === GridValue.inner) row.splice(e, 1, GridValue.outer);
						else break;
					}
				}
				//sud
				if (indexV > 0 && grid[indexV - 1][indexH] === GridValue.outer) {
					needOneMore = true;
					for (let s = indexV; s <= grid.length - 1; s++) {
						if (grid[s][indexH] === GridValue.inner)
							grid[s].splice(indexH, 1, GridValue.outer);
						else break;
					}
				}
				//nord
				if (
					indexV < grid.length - 1 &&
					grid[indexV + 1][indexH] === GridValue.outer
				) {
					needOneMore = true;
					for (let n = indexV; n > 0; n--) {
						if (grid[n][indexH] === GridValue.inner)
							grid[n].splice(indexH, 1, GridValue.outer);
						else break;
					}
				}
			}
		});
	});
	if (needOneMore) return recursiveCleanGrid(grid);
	else return grid;
}

export function hasNoInnerPoints(grid: IGrid): boolean {
	let pointsQuantity = 0;
	grid.forEach((row: GridRow, indexV: number) => {
		row.forEach((cell, indexH) => {
			if (cell === GridValue.inner) {
				pointsQuantity++;
			}
		});
	});

	return pointsQuantity === 0;
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
				row.push(hex !== bgColor ? GridValue.track : GridValue.outer);
			}
			grid.push(row);
		}
		//trovo tutti i punti della griglia interni alla pista
		grid = grid.map((row, indexV) => {
			row = row.map((cell, indexH) => {
				if (cell === GridValue.outer) {
					var counterN = 0;
					var counterS = 0;
					var counterE = 0;
					var counterO = 0;
					for (let n = 0; n < indexV; n++) {
						if (grid[n][indexH] === GridValue.track) counterN++;
					}
					for (let s = indexV; s <= grid.length - 1; s++) {
						if (grid[s][indexH] === GridValue.track) counterS++;
					}
					for (let e = 0; e <= indexH; e++) {
						if (row[e] === GridValue.track) counterE++;
					}
					for (let o = indexH; o <= row.length - 1; o++) {
						if (row[o] === GridValue.track) counterO++;
					}
					if (counterN > 0 && counterS > 0 && counterE > 0 && counterO > 0) {
						return GridValue.inner;
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
