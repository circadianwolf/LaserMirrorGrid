export { LinesweeperGrid };
import { GridBase, GridPuzzle, ProgressTrack, CellBorders } from '../Modules.js';

class LinesweeperGrid extends GridBase {
    static #puzzleInfo;

    static get #cells() {
        const gridSize = 7;
        const arr = [];
        for (let y = 0; y < gridSize; y++) {
            arr.push([]);
            for (let x = 0; x < gridSize; x++)
                arr[y].push(null);
        }
        arr[1][1] = 6;
        arr[1][5] = 8;
        arr[2][2] = 5;
        arr[3][3] = 6;
        arr[4][5] = 7;
        arr[5][3] = 7;

        return arr;
    }

    static get SingleLoopProgress() { return "SingleLoop"; }
    static get TouchingSquaresProgress() { return "TouchingSquares"; }

    static GetPuzzles() {
        if (this.#puzzleInfo == null) {
            const instructions = `Draw a single loop that passes through some of the empty squares, 
using horizontal and vertical lines. The loop cannot reenter any square.
The loop must pass through the given number of touching squares next to each number clue,
including diagonally touching squares.`;

            const progressTracks = [
                new ProgressTrack(this.SingleLoopProgress, 'Single Loop', 1),
                new ProgressTrack(this.TouchingSquaresProgress, 'Touching Squares', 6)
            ];

            this.#puzzleInfo = [
                new GridPuzzle('LinesweeperGrid', 'Linesweeper', instructions, progressTracks, LinesweeperGrid, [LinesweeperGrid.#cells])
            ];
        }

        return this.#puzzleInfo;
    }

    #pathSegments = [];
    #activePathSegmentStart = null;

    constructor(canvasId, leftX, topY, progressTracks, cells) {
        super(canvasId, leftX, topY, 50, cells, progressTracks);
    }

    //#region Overrides

    LoadCell(rowIdx, colIdx, value) {
        const cell = super.LoadCell(rowIdx, colIdx, value);
        cell.Value = new LinesweeperCellValue(value);
    }

    CellClick(cell) {
        //can't put a path on the numbered cells themselves
        if (cell.Value.RequiredCount != null)
            return;

        if (this.#activePathSegmentStart != null) {
            if (this.#activePathSegmentStart !== cell)
                this.#TryCreatePathSegment(this.#activePathSegmentStart, cell);
        }

        this.#activePathSegmentStart = cell;
    }

    DrawGrid() {
        super.DrawGrid();

        this.#DrawCellLineCounts();
        this.#DrawPath();
    }

    //#endregion

    #TryCreatePathSegment(startCell, endCell) {
        //vertical line
        if (startCell.Row === endCell.Row) {
            const y1 = Math.min(startCell.Col, endCell.Col);
            const y2 = y1 === startCell.Col ? endCell.Col : startCell.Col;

            let pathExists = true;
            const cellsToUpdate = [];
            for (let y = y1; y <= y2; y++) {
                const cellValue = this.CellGrid[startCell.Row][y].Value;
                if (cellValue.RequiredCount != null)
                    return false;

                if (y !== y2) {
                    cellsToUpdate.push(cellValue);
                    if (!cellValue.LinkedPaths.HasBorder(CellBorders.Bottom))
                        pathExists = false;
                }
            }

            for (const cellValue of cellsToUpdate) {
                if (pathExists)
                    cellValue.LinkedPaths.RemoveBorder(CellBorders.Bottom);
                else
                    cellValue.LinkedPaths.AddBorder(CellBorders.Bottom);
            }

            return true;
        }
        //horizontal line
        if (startCell.Col === endCell.Col) {
            const x1 = Math.min(startCell.Row, endCell.Row);
            const x2 = x1 === startCell.Row ? endCell.Row : startCell.Row;

            let pathExists = true;
            const cellsToUpdate = [];
            for (let x = x1; x <= x2; x++) {
                const cellValue = this.CellGrid[x][startCell.Col].Value;
                if (cellValue.RequiredCount != null)
                    return false;

                if (x !== x2) {
                    cellsToUpdate.push(cellValue);
                    if (!cellValue.LinkedPaths.HasBorder(CellBorders.Right))
                        pathExists = false;
                }
            }

            for (const cellValue of cellsToUpdate) {
                if (pathExists)
                    cellValue.LinkedPaths.RemoveBorder(CellBorders.Right);
                else
                    cellValue.LinkedPaths.AddBorder(CellBorders.Right);
            }  

            return true;
        }
        return false;
    }

    #DrawCellLineCounts() {
        for (const cell of this.CellList) {
            if (cell.Value.RequiredCount != null)
                this.DrawCellText(cell.Value.RequiredCount, cell.Row, cell.Col, 18, -12);
        }
    }

    #DrawPath() {
        this.#SetPathLineStyle(false);

        if (this.#activePathSegmentStart)
            this.FillGridRect(this.#activePathSegmentStart.Row, this.#activePathSegmentStart.Col, 20, 20, 10, 10);
            //this.DrawGridLine(this.#activePathSegmentStart.Row, this.#activePathSegmentStart.Col, this.#activePathSegmentStart.Row, this.#activePathSegmentStart.Col, 25);

        for (const cell of this.CellList)
            this.#DrawPathSegments(cell);
    }

    #DrawPathSegments(cell) {
        if (cell.Value.LinkedPaths.HasBorder(CellBorders.Bottom))
            this.DrawGridLine(cell.Row, cell.Col, cell.Row, cell.Col + 1, 25);
        if (cell.Value.LinkedPaths.HasBorder(CellBorders.Right))
            this.DrawGridLine(cell.Row, cell.Col, cell.Row + 1, cell.Col, 25);
    }

    #SetPathLineStyle(valid = false) {
        this.CanvasContext.setLineDash([]);
        this.CanvasContext.strokeStyle = valid ? '#0F0' : '#F00'; //green / red
        this.CanvasContext.lineWidth = 3; //3px thick
    }
}

class LinesweeperCellValue {
    RequiredCount = null;
    HasPath = false;
    LinkedPaths = new CellBorders();

    constructor(requiredCount = null) {
        this.RequiredCount = requiredCount;
    }
}