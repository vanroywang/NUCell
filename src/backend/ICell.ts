import { ICellObserver } from "./ICellObserver";

/**
 * A cell in a spreadsheet.
 */
export interface ICell {
    /**
     * Adds an observer to this cell that should be alerted whenever this cell's value changes.
     * @param observer The new observer.
     */
    attach(observer: ICellObserver): void;

    /**
     * removes an observer from the observers
     * @param observer The observer to be removed
     */
    detach(observer: ICellObserver): void

    /**
     * Notify all the observers of this cell that the position of this cell changed from 
     * (prevRow, preCol) to (newRow, newCol)
     * @param prevRow the previous row number of the cell
     * @param prevCol the previous column number of the cell
     * @param newRow the new row number of the cell
     * @param newCol the new column number of the cell
     */
    notifyPositionChange(prevRow: number, prevCol: number, newRow: number, newCol: number): void;

    /**
     * Notify all the observers of this cell that the evaluated value of this cell has changed to evaluatedContent 
     * @param row row number of this cell
     * @param col column number of this cell
     * @param evaluatedContent the new content of this cell
     */
    notifyValueChange(row: number, col: number, evaluatedContent: string): void;

    /**
     * Changes the color of the cell.
     * @param color a hex code. i.e. "#00FF00"
     */
    recolor(color: string): void;

    /**
     * Sets the content of the cell.
     * @param content Whatever the cell should display.
     */
    setCellContent(content: string): void;

    /**
     * Sets the evaluated content of the cell.
     * @param evalContent Whatever the cell should display.
     */
    setCellEvaluatedContent(evalContent: string): void;

    /**
     * Gets the evaluated content of the cell.
     */
    getCellEvaluatedContent(): string;

    /**
     * Gets whatever was written to the cell, even if it's a function.
     */
    getRawContent(): string;

    /**
     * Notify all the observers of this cell that this cell has been deleted
     */
    notifyDeletion(): void;

    /**
     *  Evaluates the given simplified content to result and set the evalContent to result
     */
    evaluate(): void;

    /**
     * Gets all the observers of a cell
     */
    getObservers(): ICellObserver[];

    /**
     * Adds a cell's coordinates and its value to the cell's map of cells that it observes
     * @param cellCoordinate cell's coordinate, written as row,column
     * @param value the value of the cell
     */
    addCellToMap(cellCoordinate: string, value: string): void;

    /**
     * Set the row of the cell to the given number
     * @param row the number of the row of the cell in its sheet
     * 
     */
    setRow(row: number): void;

    /**
     * Set the column of the cell to the given number
     * @param column the number of the column of the cell in its sheet
     * 
     */
    setColumn(column: number): void;

    /**
     * Gets a list of the keys of this.cellToValue
     * @returns the list containing the keys as number tuples
     */
    getPositionsInCellToValue(): [posX: number, posY: number][];
}
