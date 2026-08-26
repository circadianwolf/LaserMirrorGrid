export { TouchyGrid };
import { GridBase, GridPuzzle, ProgressTrack, CellBorders } from '../Modules.js';

class TouchyGrid extends GridBase {
    static RowProgress = "Rows";
    static ColProgress = "Columns";
    static NoDiagonalsProgress = "NoDiagonals";

    Rows = [];
    Cols = [];
}