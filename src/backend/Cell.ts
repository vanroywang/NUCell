import { ICellObserver } from "./ICellObserver";
import { ICell } from "./ICell";
import { evaluate } from 'mathjs';
import Utils from './Util'

/**
 * A generic cell to be put in a spreadsheet.
 */
export class Cell implements ICell, ICellObserver {
    private color: string;
    private content: string;
    private observers: ICellObserver[];
    private evaluatedContent: string;
    private cellToValue: Map<string, string>
    private row: number;
    private column: number;

    public constructor(row: number, column: number) {
        this.color = "#FFFFFF"; //initialized to be white
        this.content = "";
        this.observers = [];
        this.evaluatedContent = "";
        this.cellToValue = new Map<string, string>();
        this.row = row;
        this.column = column;
    }

    /**
     * Set the row of the cell to the given number
     * @param row the number of the row of the cell in its sheet
     * 
     */
    setRow(row: number): void {
        this.row = row;
    }

    /**
     * Gets a list of the keys of this.cellToValue
     * @returns the list containing the keys as number tuples
     */
    getPositionsInCellToValue(): [posX: number, posY: number][] {
        let output: [posX: number, posY: number][] = []
        this.cellToValue.forEach((value: string, key: string) => {
            let row: number = Number(key.substring(0, key.indexOf(',')));
            let column: number = Number(key.substring(key.indexOf(',') + 1, key.length));
            output.push([row, column]);
        });
        return output;
    }

    /**
     * Set the column of the cell to the given number
     * @param column the number of the column of the cell in its sheet
     * 
     */
    setColumn(column: number): void {
        this.column = column;
    }

    /**
     * Returns the row position of the cell
     * @returns a number that is the row position of the cell
     */
    getRow(): number {
        return this.row;
    }

    /**
     * Returns the column position of the cell
     * @returns a number that is the the column position of the cell
     */
    getColumn(): number {
        return this.column;
    }

    /**
     *  An observed cell calls this function on each of its observers when that cell's content has changed. It updates the content of this cell.
     *  @param row the row number from the cell being observed
     *  @param col the column number from the cell being observed
     *  @param evaluatedContent the new evaluated content of the cell being observed
     */
    updateEvaluate(row: number, col: number, evaluatedContent: string): void {
        this.cellToValue.set(String(row) + "," + String(col), evaluatedContent);
        this.evaluate();
        this.notifyValueChange(this.row, this.column, this.evaluatedContent);
    }

    /**
     * Adds this cell's coordinates and its value to the cell's map of cells that it observes
     * @param cellCoordinate cell's coordinate, written as row,column
     * @param value the value of the cell
     */
    addCellToMap(cellCoordinate: string, value: string): void {
        this.cellToValue.set(cellCoordinate, value);
    }

    /**
     * Gets all the observers of this cell
     * @return list of observers of the cell
     */
    getObservers(): ICellObserver[] {
        return this.observers;
    }

    /**
     * Takes in a string representation of one of the two spreadsheet function(AVG, SUM) with specified a range of cells 
     * with a start cell and an end cell seperated by ":"
     * @param match the string representation of a function including the cells that it specifies
     * @returns a list of the evaluated content of the specified cells
     */
    private parseCellsForRangedExpression(match: string) {
        let arrayOfEvalContent: string[] = [];
        match = match.substring(4, match.length - 1)
        var positionsOfSheet = match.split(":");

        var pos1 = Utils.UIPositionToModelPosition(positionsOfSheet[0].trim());
        var pos2 = Utils.UIPositionToModelPosition(positionsOfSheet[1].trim());

        // Either start or end element is out of the range of existing cells.
        if (pos1 === undefined || pos2 === undefined) {
            return undefined;
        }

        var positionsToFindEvalCont = Utils.loopThroughRangeOfPositions(pos1, pos2);

        for (let pos of positionsToFindEvalCont) {
            let content = this.cellToValue.get(String(pos[0]) + "," + String(pos[1]));
            if (content === "" || content === undefined) {
                content = "0";
            }
            arrayOfEvalContent.push(content);
        }
        return arrayOfEvalContent;
    }

    /**
     * Takes in a string representation of one of the three spreadsheet function(AVG, SUM) with specified a list of cells seperated by ","
     * @param match the string representation of a function including the cells that it specifies
     * @returns a list of the evaluated content of the specified cells
     */
    private parseCellsForListExpression(match: string) {
        let arrayOfEvalContent: string[] = [];
        match = match.substring(4, match.length - 1)
        var positionsOfSheet = match.split(",");
        for (let pos of positionsOfSheet) {

            let modelPos = Utils.UIPositionToModelPosition(pos.trim())

            // Any of the selected cells (separated by commas) don't exist.
            if (modelPos === undefined) {
                return undefined;
            }

            let content = this.cellToValue.get(String(modelPos[0]) + "," + String(modelPos[1]));
            if (content === "" || content === undefined) {
                content = "0";
            }
            arrayOfEvalContent.push(content);
        }
        return arrayOfEvalContent;
    }

    /**
     * Takes in a string representation of one of the three spreadsheet function(AVG, SUM, REF) with a single specified cell
     * @param match the string representation of a function including the cell that it specifies
     * @returns a list containing the evaluated value of the specified cell
     */
    private parseCellsForSingleExpression(match: string) {
        let arrayOfEvalContent: string[] = [];
        match = match.substring(4, match.length - 1);
        let modelPos: [posX: number, posY: number] | undefined = Utils.UIPositionToModelPosition(match.trim())
        if (modelPos !== undefined) {
            let content = this.cellToValue.get(String(modelPos[0]) + "," + String(modelPos[1]));
            if (content === "" || content === undefined) {
                content = "0";
            }
            arrayOfEvalContent.push(content);

        }
        return arrayOfEvalContent;
    }

    /**
     * Takes in a string representation of one of the three spreadsheet function(AVG, SUM, REF) with specified cell(s)
     * The representation of the cells could be a plain single cell, a list of any cardinality seperated by ",", or a range 
     * with a start cell and an end cell separated by ":"
     * @param match the string representation of a function including the cell(s) that it specifies
     * @returns a list of the evaluated content of the specified cell(s)
     */
    private parseCellsToContents(match: string): string[] | undefined {
        let arrayOfEvalContent: string[] | undefined = [];

        if (match.includes(":") && !match.includes(",")) {
            if (this.parseCellsForRangedExpression(match) == undefined) {
            } else {
                arrayOfEvalContent = this.parseCellsForRangedExpression(match);
            }
        }
        else if (match.includes(",") && !match.includes(":")) {
            if (this.parseCellsForListExpression(match) == undefined) {
            } else {
                arrayOfEvalContent = this.parseCellsForListExpression(match);
            }
        }
        else {
            if (this.parseCellsForSingleExpression(match) == undefined) {
            } else {
                arrayOfEvalContent = this.parseCellsForSingleExpression(match);
            }
        }

        return arrayOfEvalContent;
    }

    /**
     * Evaluate the functions(REF, AVG, SUM) in a given string content, and return the content with the functions replaced
     * with their corresponding evaluated value
     * @param trimmedContent the input content 
     * @param matchesArray the array containing the functions
     * @returns the content with functions replaced with actual value
     */
    private evaluateContentWithFunctionHelper(trimmedContent: string, matchesArray: string[]): string {
        let referenceEvaluatedContent = trimmedContent;
        let ifNotNumberStopEval = false;
        for (let match of matchesArray) {
            if (ifNotNumberStopEval) {
                break;
            }
            let matchSubstring = match.substr(0, 3)
            switch (matchSubstring) {
                case "REF": {
                    let arrayOfEvalCont = this.parseCellsToContents(match);
                    if (arrayOfEvalCont !== undefined && arrayOfEvalCont.length === 1) {
                        referenceEvaluatedContent = referenceEvaluatedContent.replace(match, arrayOfEvalCont[0]);
                    }
                    break;
                }
                case "SUM": {
                    let arrayOfEvalCont = this.parseCellsToContents(match)
                    let sum = 0;
                    if (arrayOfEvalCont !== undefined) {
                        for (let content of arrayOfEvalCont) {
                            if (isNaN(Number(content))) {
                                ifNotNumberStopEval = true;
                                referenceEvaluatedContent = "ERROR: SUM cannot perform on non-numbers"
                                break;
                            }
                            sum = sum + Number(content);
                        }

                    }
                    referenceEvaluatedContent = referenceEvaluatedContent.replace(match, String(sum));
                    break;
                }
                case "AVG": {
                    let arrayOfEvalCont = this.parseCellsToContents(match)
                    let sum = 0;

                    if (arrayOfEvalCont === undefined) {
                        break;
                    }
                    if (arrayOfEvalCont !== undefined) {
                        for (let content of arrayOfEvalCont) {
                            if (isNaN(Number(content))) {
                                ifNotNumberStopEval = true;
                                referenceEvaluatedContent = "ERROR: AVG cannot perform on non-numbers"
                                break;
                            }
                            sum = sum + Number(content);
                        }

                        let avg = sum / arrayOfEvalCont.length
                        referenceEvaluatedContent = referenceEvaluatedContent.replace(match, String(avg));
                    }
                    break;
                }
                default: {
                    referenceEvaluatedContent = "ERROR: Invalid function."
                    break;
                }
            }
        }
        return referenceEvaluatedContent;
    }
    /**
     *  Evaluates the given simplified content to result and set the evalContent to result
     */
    evaluate(): void {
        var trimmedContent = this.getRawContent().trim();
        if (!trimmedContent.startsWith("=")) {
            this.setCellEvaluatedContent(trimmedContent);
        }
        // starts with equal sign
        else {
            const expression = /[A-Za-z]{3}[(][\d+A-Z+a-z,+: ]*[)]/g
            let matches_array: string[] | null = trimmedContent.match(expression);

            if (matches_array !== null) {
                trimmedContent = this.evaluateContentWithFunctionHelper(trimmedContent, matches_array);

            }
            //if trimmedContent is already an error, just set and end
            if (trimmedContent.startsWith("ERROR:")) {
                this.setCellEvaluatedContent(trimmedContent);
                return;
            }
            let trimmedContentNoEqual = trimmedContent.substr(1, trimmedContent.length).trim();
            let containsNumber = false;
            let containsString = false;
            if (trimmedContentNoEqual.length !== 0 || trimmedContentNoEqual.trim().length !== 0) {
                let splitContent = trimmedContentNoEqual.split(/[*+/^()\][-]/)
                for (let content of splitContent) {
                    if (isNaN(Number(content))) {
                        containsString = true;
                    }
                    else {
                        containsNumber = true;
                    }
                }
            }

            if (!containsString && !containsNumber) {
                trimmedContentNoEqual = "ERROR: No function given after ="
                this.setCellEvaluatedContent(trimmedContentNoEqual);
            }
            // case where there are only strings in the string to be evaluated
            else if (containsString && !containsNumber) {
                this.evaluateStringHelper(trimmedContentNoEqual);
            }

            // case where there are only numbers in the string to be evaluated
            else if (containsNumber && !containsString) {
                this.evaluateMathHelper(trimmedContentNoEqual);
            }
            // case where there are both numbers and strings in the string to be evaluated
            else {
                trimmedContentNoEqual = "ERROR: Type mismatch"
                this.setCellEvaluatedContent(trimmedContentNoEqual);
            }
        }
    }


    /**
     * evaluates the content of a cell when there are only numbers to be evaluated
     * @param trimmedContentNoEqual the content to evaluate
     */
    private evaluateMathHelper(trimmedContentNoEqual: string): void {
        let trimmedContentNoEqualEvaluated = String(Math.round(evaluate(trimmedContentNoEqual) * 1000) / 1000);
        if (Number(trimmedContentNoEqualEvaluated) === Infinity || Number(trimmedContentNoEqualEvaluated) === -Infinity) {
            trimmedContentNoEqualEvaluated = "ERROR: Divide By Zero"
        }
        else if (isNaN(Number(trimmedContentNoEqualEvaluated))) {
            trimmedContentNoEqualEvaluated = "ERROR: Zero divided By Zero"
        }

        this.setCellEvaluatedContent(trimmedContentNoEqualEvaluated);
    }

    /**
     * evaluates the content of a cell when it contains strings only
     * @param trimmedContent the content to evaluate
     */
    private evaluateStringHelper(trimmedContent: string): void {
        let splitByPlus: string[] = trimmedContent.split(/[+]/);

        let concatString = "";
        if (splitByPlus.length === 1) {
            this.setCellEvaluatedContent(splitByPlus[0]);
            return;
        } else {
            for (let s of splitByPlus) {
                s = s.trim();
                if (s.startsWith('"')) {
                    s = s.substring(1, s.length)
                }
                if (s.endsWith('"')) {
                    s = s.substring(0, s.length - 1)
                }
                concatString = concatString + s;
            }
            this.setCellEvaluatedContent(concatString);
        }
    }

    /**
     * Set the evaluated content of the cell to be evalContent
     * @param evalContent the content to set
     */
    setCellEvaluatedContent(evalContent: string): void {
        this.evaluatedContent = evalContent;
    }

    /**
     * Gets the evaluated content of this cell
     * @returns the evaluated content
     */
    getCellEvaluatedContent(): string {
        return this.evaluatedContent;
    }

    /**
     * An observed cell calls this function on each of its observers when that cell is deleted or having a reference error.
     * It sets the content of the cell to "ERROR: invalid reference" and re-evaluates. 
     * It also notifies deletion of a cell to all observers of this cell (recursively). 
     */
    updateReferenceError(): void {
        this.content = "ERROR: invalid reference.";
        this.evaluate();
        this.notifyDeletion();
    }

    /**
     * An observed cell calls this function on each of its observers when that cell's position was changed due to adding/deleting a row/column.
     * Updates the cell's raw content to replace the previous row/column of any referenced cell with the new ones.
     * Updates the cell's map to have a key of the new coordinate with value that of the old coordinate in the map.
     * @param prevRow the previous row number of the cell that was affected by adding/deleting
     * @param prevCol the previous column number of the cell that was affected by adding/deleting
     * @param newRow the new row number of the cell that was affected by adding/deleting
     * @param newCol the new column number of the cell that was affected by adding/deleting
     */
    updateReference(prevRow: number, prevCol: number, newRow: number, newCol: number): void {
        let prevColLabel: string = Utils.numToLetters(prevCol);
        let newColLabel: string = Utils.numToLetters(newCol);
        let prevRowLabel: string = String(prevRow + 1);
        let newRowLabel: string = String(newRow + 1);
        this.content = this.content.replace(prevColLabel + prevRowLabel, newColLabel + newRowLabel);
        let cellPosition = String(newRow) + "," + String(newCol);
        let currentValue = this.cellToValue.get(String(prevRow) + "," + String(prevCol));
        if (currentValue !== undefined) {
            this.cellToValue.set(cellPosition, currentValue);
        }
        this.evaluate();
    }

    /**
     * Notify all the observers of this cell that the position of this cell changed from 
     * (prevRow, preCol) to (newRow, newCol)
     * @param prevRow the previous row number of the cell
     * @param prevCol the previous column number of the cell
     * @param newRow the new row number of the cell
     * @param newCol the new column number of the cell
     */
    notifyPositionChange(prevRow: number, prevCol: number, newRow: number, newCol: number): void {
        for (let observer of this.observers) {
            observer.updateReference(prevRow, prevCol, newRow, newCol);
        }
    }

    /**
     * Notify all the observers of this cell that the evaluated value of this cell has changed to evaluatedContent 
     * @param row row number of this cell
     * @param col column number of this cell
     * @param evaluatedContent the new content of this cell
     */
    notifyValueChange(row: number, col: number, evaluatedContent: string): void {
        for (let observer of this.observers) {
            observer.updateEvaluate(row, col, evaluatedContent);
        };
    }

    /**
     * Adds an observer to this cell that should be alerted whenever this cell's value changes.
     * @param observer The new observer.
     */
    public attach(observer: ICellObserver): void {
        this.observers.push(observer);
    }

    /**
     * removes an observer from the observers
     * @param observer The observer to be removed
     */
    public detach(observer: ICellObserver): void {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    /**
     * Changes the color of the cell.
     * @param color a hex code. i.e. "#00FF00"
     */
    public recolor(color: string): void {
        this.color = color;
    }

    /**
     * Gets the color of the cell.
     * @returns a string representing the hex code color of the cell
     */
    public getColor(): string {
        return this.color;
    }

    /**
     * Sets the content of the cell.
     * @param content Whatever the cell should display.
     */
    public setCellContent(content: string): void {
        this.content = content;
    }

    /**
     * Gets whatever was written to the cell, even if it's a function.
     */
    public getRawContent(): string {
        return this.content;
    }

    /**
     * Notify all the observers of this cell that this cell has been deleted
     */
    public notifyDeletion(): void {
        for (let observer of this.observers) {
            observer.updateReferenceError();
        }
    }

}


