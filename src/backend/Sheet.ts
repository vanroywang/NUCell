import { Cell } from "./Cell";
import Utils from './Util';

/**
 * A grid of cells.
 */
export class Sheet {
    private cells: Cell[][];

    public constructor(width: number, height: number) {
        this.cells = [];

        for (var i: number = 0; i < height; i++) {
            this.cells[i] = [];
            for (var j: number = 0; j < width; j++) {
                this.cells[i][j] = new Cell(i, j);
            }
        }
    }


    /**
     * returns the raw content of the cell with the given position
     * @param row the row of the cell
     * @param col the column of the cell
     * @returns the raw content of the cell with the given position
     */
    public getRawCell(row: number, col: number) {
        return this.cells[row][col].getRawContent();
    }


    /**
     * helper function to create CSV in front end
     * @returns 2D string array containing the raw content of each cell in the sheet
     */
    public getRawMatrixData(): string[][] {
        const rawData: string[][] = [];
        for (let row of this.cells) {
            const rawRow: string[] = [];
            for (let cell of row) {
                rawRow.push(cell.getRawContent());
            }
            rawData.push(rawRow)
        }
        return rawData;
    }

    /**
     * Clear the contents of a cell. 
     * @param row row position of cell
     * @param column column position of cell
     */
    public clearCell(row: number, column: number): void {
        this.changeCellContent("", row, column);
    }

    /**
     * Adds a column to the left of the given column.
     * @param x The column to put the new column next to.
     */
    public addColumn(x: number): void {
        let newcells: Cell[][] = this.getEmptySheet(this.getNumOfRow(), this.getNumOfColumn() + 1);

        for (var i: number = 0; i < this.getNumOfRow(); i++) {
            for (var j: number = 0; j < x; j++) {
                newcells[i][j] = this.cells[i][j];
            }
        }
        for (var i: number = 0; i < this.getNumOfRow(); i++) {
            for (var j: number = this.getNumOfColumn(); j > x; j--) {
                newcells[i][j] = this.cells[i][j - 1]
                newcells[i][j].notifyPositionChange(i, j - 1, i, j);
                newcells[i][j].setColumn(j);
            }
        }
        this.cells = newcells;
        for (var i: number = 0; i < this.getNumOfRow(); i++) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                this.addColumnHelper(x, this.cells[i][j].getRawContent(), i, j);
            }
        }
    }

    /**
     * Initialize an empty sheet with specified number of rows and columns
     * @param numberOfRows number of rows
     * @param numberOfCols number of columns
     * @returns the empty sheet
     */
     private getEmptySheet(numberOfRows: number, numberOfCols: number): Cell[][] {
        let newcells: Cell[][] = [];
        for (var i: number = 0; i < numberOfRows; i++) {
            newcells[i] = [];
            for (var j: number = 0; j < numberOfCols; j++) {
                newcells[i][j] = new Cell(i, j);

            }
        }
        return newcells;
    }
    /**
     * Adds a row above the given row.
     * @param y The row to add row above
     */
    public addRow(y: number): void {
        let newcells: Cell[][] = this.getEmptySheet(this.getNumOfRow() + 1, this.getNumOfColumn());

        for (var i: number = 0; i < y; i++) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                newcells[i][j] = this.cells[i][j];
            }
        }
        for (var i: number = this.getNumOfRow(); i > y; i--) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                newcells[i][j] = this.cells[i - 1][j]
                newcells[i][j].notifyPositionChange(i - 1, j, i, j);
                newcells[i][j].setRow(i);
            }
        }
        this.cells = newcells;
        for (var i: number = 0; i < this.getNumOfRow(); i++) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                this.addRowHelper(y, this.cells[i][j].getRawContent(), i, j);
            }
        }
    }

    /**
     * checks if there is a cell that contains ranged expression that includes the added row,
     * and attach observers.
     * @param y the row number where the row is added
     * @param content the content of the cell
     * @param cellRow row position of cell 
     * @param cellCol column position of cel
     */
    public addRowHelper(y: number, content: string, cellRow: number, cellCol: number): void {
        if (content.startsWith("=")) {
            const expression = /[A-Z]{3}[(].*:.*[)]/g
            let matches_Of_Functions_array: string[] | null = content.match(expression);
            if (matches_Of_Functions_array !== null) {
                for (let match of matches_Of_Functions_array) {
                    match = match.substring(4, match.length - 1);
                    var positionsOfSheet = match.split(":");
                    if (positionsOfSheet !== undefined) {
                        var pos1 = Utils.UIPositionToModelPosition(positionsOfSheet[0].trim());
                        var pos2 = Utils.UIPositionToModelPosition(positionsOfSheet[1].trim());
                    }
                    if (pos1 !== undefined && pos2 !== undefined) {
                        var maxPosRow = Math.max(pos1[0], pos2[0])
                        var minPosRow = Math.min(pos1[0], pos2[0])
                        var maxPosCol = Math.max(pos1[1], pos2[1])
                        var minPosCol = Math.min(pos1[1], pos2[1])
                        if (y >= minPosRow && y <= maxPosRow) {
                            for (let i = minPosCol; i <= maxPosCol; i++) {
                                this.getCellAtPosition(y, i).attach(this.cells[cellRow][cellCol]);
                            }
                        }
                    }
                }
            }


        }
    }

    /**
     * checks if there is a cell that contains ranged expression that includes the added column,
     * and attach observers.
     * @param x the column number where the row is added
     * @param content the content of the cell
     * @param cellRow row position of cell 
     * @param cellCol column position of cel
     */
    public addColumnHelper(x: number, content: string, cellRow: number, cellCol: number): void {
        if (content.startsWith("=")) {
            const expression = /[A-Z]{3}[(].*:.*[)]/g
            let matches_Of_Functions_array: string[] | null = content.match(expression);
            if (matches_Of_Functions_array !== null) {
                for (let match of matches_Of_Functions_array) {
                    match = match.substring(4, match.length - 1);
                    var positionsOfSheet = match.split(":");
                    if (positionsOfSheet !== undefined) {
                        var pos1 = Utils.UIPositionToModelPosition(positionsOfSheet[0].trim());
                        var pos2 = Utils.UIPositionToModelPosition(positionsOfSheet[1].trim());
                    }
                    if (pos1 !== undefined && pos2 !== undefined) {
                        var maxPosRow = Math.max(pos1[0], pos2[0])
                        var minPosRow = Math.min(pos1[0], pos2[0])
                        var maxPosCol = Math.max(pos1[1], pos2[1])
                        var minPosCol = Math.min(pos1[1], pos2[1])
                        if (x >= minPosCol && x <= maxPosCol) {
                            for (let i = minPosRow; i <= maxPosRow; i++) {
                                this.getCellAtPosition(i, x).attach(this.cells[cellRow][cellCol]);
                            }
                        }
                    }
                }
            }
        }
    }


    /**
     * Deletes a column.
     * @param x The column number to delete.
     */
    public deleteColumn(x: number): void {
        let newcells: Cell[][] = this.getEmptySheet(this.getNumOfRow(), this.getNumOfColumn() - 1);
        for (var rowNumber: number = 0; rowNumber < this.getNumOfRow(); rowNumber++) {
            for (var columnNumber: number = 0; columnNumber < x; columnNumber++) {
                newcells[rowNumber][columnNumber] = this.cells[rowNumber][columnNumber];
            }
        }
        for (var rowNumber: number = 0; rowNumber < this.getNumOfRow(); rowNumber++) {
            for (var columnNumber: number = x; columnNumber < this.getNumOfColumn() - 1; columnNumber++) {
                newcells[rowNumber][columnNumber] = this.cells[rowNumber][columnNumber + 1];
                //newcells[i][j].notifyPositionChange(); //notify needs to take in i j and i-1 j
                newcells[rowNumber][columnNumber].notifyPositionChange(rowNumber, columnNumber + 1, rowNumber, columnNumber);
                newcells[rowNumber][columnNumber].setColumn(columnNumber);
            }
        }
        for (let rowNumber: number = 0; rowNumber < this.getNumOfRow(); rowNumber++) {
            this.cells[rowNumber][x].notifyDeletion()
        }

        this.cells = newcells;

    }


    /**
     * Deletes a row.
     * @param y The row number to delete.
     */
    public deleteRow(y: number): void {
        let newcells: Cell[][] = this.getEmptySheet(this.getNumOfRow() - 1, this.getNumOfColumn());
        for (var i: number = 0; i < y; i++) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                newcells[i][j] = this.cells[i][j];
            }
        }
        for (var i: number = y; i < this.getNumOfRow() - 1; i++) {
            for (var j: number = 0; j < this.getNumOfColumn(); j++) {
                newcells[i][j] = this.cells[i + 1][j]
                newcells[i][j].notifyPositionChange(i + 1, j, i, j);
                newcells[i][j].setRow(i);
            }
        }
        for (let j: number = 0; j < this.getNumOfColumn(); j++) {
            this.cells[y][j].notifyDeletion()
        }
        this.cells = newcells;

    }


    /**
     * Set the color of the cell at the given position to be the provided color
     * @param row of the cell to recolor
     * @param column of the cell to recolor
     * @param color color in hex code format
     */
    public changeColorAtCell(row: number, column: number, color: string) {
        this.getCellAtPosition(row, column).recolor(color);
    }

    /**
     * returns a list of the possible evaluated contents in the column from under the cell that calls
     * filter to (not include) the first empty cell that appears
     * @param row: row of the cell that called filter
     * @param col: column of the cell that called filter
     */
    public getFilterList(row: number, col: number): Set<string> {
        if (row < 0 || col < 0)
            return new Set;

        let output: Set<string> = new Set;
        let currentRow = row + 1;
        while (currentRow < this.getNumOfRow() && this.getCellAtPosition(currentRow, col).getCellEvaluatedContent() !== "") {
            output.add(this.getCellAtPosition(currentRow, col).getCellEvaluatedContent());
            currentRow++;
        }
        return output
    }
    /**
     * Filters a column based on a filter.
     * @param filter The filter to use.
     */
    public filterColumn(filter: string, row: number, col: number): number[] {
        let output: number[] = [];
        let currentRow = row + 1;
        while (currentRow < this.getNumOfRow()
            && this.getCellAtPosition(currentRow, col).getCellEvaluatedContent() !== "") {
            if (String(this.getCellAtPosition(currentRow, col).getCellEvaluatedContent()) === filter) {
                output.push(currentRow)
            }
            currentRow++;
        }
        return output
    };

    /**
     * Gets the number of rows of the sheet
     * @return number of rows of the sheet
     */
    public getNumOfRow(): number {
        return this.cells.length
    }

    /**
     * Gets the number of columns of the sheet
     * @return number of columns of the sheet
     */
    public getNumOfColumn(): number {
        return this.cells[0].length
    }


    /**
     * checks if the given list of positions from a cell's content are valid
     * @param positionsOfSheet list of positions from a cell's content
     * @return a boolean that is True is the positions are valid and False if they are not valid
     */
    public checkIfValidPosition(positionsOfSheet: string[], row: number, col: number) {
        let expression = /[A-Za-z]+[\d]+/g
        let isValid = true
        for (let pos of positionsOfSheet) { // B1 or 4 //HELLO12
            let modelPos: [row: number, col: number] | undefined = Utils.UIPositionToModelPosition(pos);
            let validPositions = pos.trim().match(expression);
            if (modelPos === undefined) {
                isValid = false;
                break;
            }
            if ((modelPos[0] === row) && (modelPos[1] === col)) {
                isValid = false;
                break;
            }
            if (validPositions === null) {
                isValid = false;
                break;
            }
            if (validPositions.length > 1) {
                isValid = false;
                break;
            }
            if (validPositions[0] !== pos.trim()) {
                isValid = false;
                break;
            }
            if (modelPos[0] >= this.getNumOfRow() || modelPos[1] >= this.getNumOfColumn()) {
                isValid = false;
                break;
            }
        }
        return isValid
    }
    /**
     * Changes the content of a cell at the given row and colum, and iteratively updates its map of label -> value
     * -1 is returned when the position provided was invalid. _match_ is a ranged expression for cells
     * @param content : the cell's content
     * @param match : the match of a reference function (ex: REF, SUM, AVG)
     * @param row : the row number of the cell
     * @param column : the column number of the cell
     * @return the exit status with -1 being the error code
     */
     private changeContentForRangedExpression(content: string, match: string, row: number, column: number): number {
        match = match.substring(4, match.length - 1);
        var positionsOfSheet = match.split(":");
        let isValid = this.checkIfValidPosition(positionsOfSheet, row, column);
        if (!isValid) {
            this.cells[row][column].setCellContent(content);
            this.cells[row][column].setCellEvaluatedContent("ERROR: invalid cell positions")
            return -1;
        }
        var pos1 = Utils.UIPositionToModelPosition(positionsOfSheet[0].trim());
        var pos2 = Utils.UIPositionToModelPosition(positionsOfSheet[1].trim());

        // Shouldn't get here BUT, if the cell's position doesn't exist, we just return -1 since it is invalid
        if (pos1 === undefined || pos2 === undefined) {
            return -1
        }
        var positionsToObserve = Utils.loopThroughRangeOfPositions(pos1, pos2)
        for (let pos of positionsToObserve) {
            if (this.hasCircularReference(pos, [row, column])) {
                this.cells[row][column].setCellEvaluatedContent("ERROR: circular reference failed to set content")
                return -1;
            }
            this.cells[pos[0]][pos[1]].attach(this.cells[row][column])
            this.cells[row][column].setCellContent(content);
            this.cells[row][column].addCellToMap(String(pos[0]) + "," + String(pos[1]), this.cells[pos[0]][pos[1]].getCellEvaluatedContent());
            this.cells[row][column].evaluate();
            this.cells[row][column].notifyValueChange(row, column, this.cells[row][column].getCellEvaluatedContent());
        }
        return 0;
    }

    /**
     * Changes the content of a cell at the given row and colum, and iteratively updates its map of label -> value
     * -1 is returned when the position provided was invalid. _match_ is a LIST expression for cells
     * @param content : the cell's content
     * @param match : the match of a reference function (ex: REF, SUM, AVG)
     * @param row : the row number of the cell
     * @param column : the column number of the cell
     * @return the exit status with -1 being the error code
     */
     private changeContentForListExpression(content: string, match: string, row: number, column: number): number {
        match = match.substring(4, match.length - 1);
        var positionsOfSheet = match.split(",");
        let isValid = this.checkIfValidPosition(positionsOfSheet, row, column);
        if (!isValid) {
            this.cells[row][column].setCellContent(content);
            this.cells[row][column].setCellEvaluatedContent("ERROR: invalid cell positions")
            return -1
        }
        for (let pos of positionsOfSheet) {
            let modelPos: [posX: number, posY: number] | undefined = Utils.UIPositionToModelPosition(pos.trim());

            // Shouldn't get here BUT, if the cell's position doesn't exist, we just return -1 since it is invalid
            if (modelPos === undefined) {
                return -1;
            } else {
                if (this.hasCircularReference(modelPos, [row, column])) {
                    this.cells[row][column].setCellEvaluatedContent("ERROR: circular reference failed to set content")
                    return -1;
                }
                this.cells[modelPos[0]][modelPos[1]].attach(this.cells[row][column]);
                this.cells[row][column].addCellToMap(String(modelPos[0]) + "," + String(modelPos[1]), this.cells[modelPos[0]][modelPos[1]].getCellEvaluatedContent());
            }
        }
        this.cells[row][column].setCellContent(content);
        this.cells[row][column].evaluate();
        this.cells[row][column].notifyValueChange(row, column, this.cells[row][column].getCellEvaluatedContent());
        return 0
    }

    /**
     * Changes the content of a cell at the given row and column, and iteratively updates its map of label -> value
     * -1 is returned when the position provided was invalid. _match_ is a single expression for cell
     * @param content : the cell's content
     * @param match : the match of a reference function (ex: REF, SUM, AVG)
     * @param row : the row number of the cell
     * @param column : the column number of the cell
     * @return the exit status with -1 being the error code
     */
     private changeContentForSingleExpression(content: string, match: string, row: number, column: number): number {
        match = match.substring(4, match.length - 1);
        let isValid = this.checkIfValidPosition([match], row, column);
        if (!isValid) {
            this.cells[row][column].setCellContent(content);
            this.cells[row][column].setCellEvaluatedContent("ERROR: invalid cell position")
            return -1;
        }
        let modelPos: [posX: number, posY: number] | undefined = Utils.UIPositionToModelPosition(match.trim());
        if (modelPos !== undefined) {
            if (this.hasCircularReference(modelPos, [row, column])) {
                this.cells[row][column].setCellEvaluatedContent("ERROR: circular reference failed to set content")
                return -1;
            }
            this.cells[modelPos[0]][modelPos[1]].attach(this.cells[row][column]);
            this.cells[row][column].addCellToMap(String(modelPos[0]) + "," + String(modelPos[1]), this.cells[modelPos[0]][modelPos[1]].getCellEvaluatedContent());
        }
        this.cells[row][column].setCellContent(content);
        this.cells[row][column].evaluate();
        this.cells[row][column].notifyValueChange(row, column, this.cells[row][column].getCellEvaluatedContent());
        return 0;
    }



    /**
     * checks if there exist circular reference between the cells at the provided positions
     * @param pos1 : the position of one cell
     * @param pos1 : the position of the other cell
     * @return whether there exist a circular reference between the two cells
     */
     private hasCircularReference(pos1: [posX: number, posY: number], pos2: [posX: number, posY: number]): boolean {
        for (let reference of this.getCellAtPosition(pos1[0], pos1[1]).getPositionsInCellToValue()) {
            if (Utils.posEqual(reference, pos2) || this.hasCircularReference(reference, pos2)) {
                return true;
            }
        }
        return false
    }

    /**
     * Changes the content of a cell at the given row and column to the provided content
     * @param content : the cell's content
     * @param row : the row number of the cell
     * @param column : the column number of the cell
     */
    public changeCellContent(content: string, row: number, column: number): void {
        if (row === -1 || column === -1)
            return;
        const expression = /[A-Z]{3}[(][^)]*[)]/g  //changed to *
        let matches_array: string[] | null = content.match(expression);
        // this is the case where there are no reference functions (ex: REF, SUM, AVG)
        if (matches_array == null) {
            this.cells[row][column].setCellContent(content);
            this.cells[row][column].evaluate();
            this.cells[row][column].notifyValueChange(row, column, this.cells[row][column].getCellEvaluatedContent());
        }
        else {
            for (let match of matches_array) {
                // case where we must parse through range of positions
                if (match.includes(":") && !match.includes(",")) {
                    if (this.changeContentForRangedExpression(content, match, row, column) === -1) {
                        break;
                    };
                }
                // case where there is a list of positions
                else if (match.includes(",") && !match.includes(":")) {
                    if (this.changeContentForListExpression(content, match, row, column) === -1) {
                        break;
                    }
                }
                // case where there is just one position given
                else {
                    if (this.changeContentForSingleExpression(content, match, row, column) === -1) {
                        break;
                    }
                }

            }
        }
    }

    /**
     * Returns a specific cell at a coordinate in the sheet.
     * @param x The row number of the cell.
     * @param y The column number of the cell.
     * @return the cell at the given position
     */
    public getCellAtPosition(x: number, y: number): Cell {
        return this.cells[x][y]
    }

}
