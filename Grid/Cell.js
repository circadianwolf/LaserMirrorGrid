export { Cell };
import { CellBorders } from './CellBorders.js';

class Cell {
    Row = -1;
    Col = -1;
    Value;
    Borders = new CellBorders();

    /**
     * @param {number} row
     * @param {number} col
     * @param {string} value
     */
    constructor(row, col, value) {
        this.Row = row;
        this.Col = col;
        this.Value = value;
    }
}