import { ICell } from "./ICell";

/**
 * Observers designed to observe cells.
 */
export interface ICellObserver {

    /**
     *  An observed cell calls this function on each of its observers when that cell's content has changed. It updates the content of this cell.
     *  @param row the row number from the cell being observed
     *  @param col the column number from the cell being observed
     *  @param evaluatedContent the new evaluated content of the cell being observed
     */
    updateEvaluate(row: number, col: number, evaluatedContent: string): void;

    /**
     * An observed cell calls this function on each of its observers when that cell's position was changed due to adding/deleting a row/column.
     * Updates the cell's raw content to replace the previous row/column of any referenced cell with the new ones.
     * Updates the cell's map to have a key of the new coordinate with value that of the old coordinate in the map.
     * @param prevRow the previous row number of the cell that was affected by adding/deleting
     * @param prevCol the previous column number of the cell that was affected by adding/deleting
     * @param newRow the new row number of the cell that was affected by adding/deleting
     * @param newCol the new column number of the cell that was affected by adding/deleting
     */
    updateReference(prevRow: number, prevCol: number, newRow: number, newCol: number): void;

    /**
     * An observed cell calls this function on each of its observers when that cell is deleted or having a reference error.
     * It sets the content of the cell to "ERROR: invalid reference" and re-evaluates. 
     * It also notifies deletion of a cell to all observers of this cell (recursively). 
     */
    updateReferenceError(): void;


}