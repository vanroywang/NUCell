export default class Utils {
    /**
    * Converts the position from UI format (letter + number starting from 1) to model coordinate format
    * (pair of numbers starting from 0)
    * @param position the position given in UI format (ex: B1)
    * @returns a number tuple containing the row position and col position (ex: (0,1))
    */
    static UIPositionToModelPosition(position: String): [posX: number, posY: number] | undefined {
        var expression_col = /[A-Za-z]+/
        var matches_array_col = position.match(expression_col);
        var expression_row = /[\d]+/
        var matches_array_row = position.match(expression_row);
        if (matches_array_col === null || matches_array_row === null) {
            return undefined;
        }
        var colPosition = this.letterToNum(matches_array_col[0]);
        var rowPosition = Number(matches_array_row[0]) - 1;
        return [rowPosition, colPosition]
    }

    /**
    * generates a list consisting all the coordinate position in the range from pos1 to pos2 
    * or from pos2 to pos 1. The iteration goes from the position with the lower cordinates 
    * to the other.
    * @param pos1 one of the given position
    * @param pos2 one of the given position
    * @returns a list of all the cells that is in the range from pos1 to pos2
    */
    static loopThroughRangeOfPositions(pos1: [posX: number, posY: number] | undefined, pos2: [posX2: number, posY2: number] | undefined) {
        if (pos1 === undefined || pos2 === undefined) {
            throw new Error("Position(s) undefined");
        } else {
            var lowestRowPos = Math.min(pos1[0], pos2[0])
            var highestRowPos = Math.max(pos1[0], pos2[0])
            var lowestColPos = Math.min(pos1[1], pos2[1])
            var highestColPos = Math.max(pos1[1], pos2[1])
            let positions: [posX: number, posY: number][] = [];
            for (var i = lowestRowPos; i <= highestRowPos; i++) {
                for (var j = lowestColPos; j <= highestColPos; j++) {
                    positions.push([i, j])
                }
            }
            return positions
        }
    }
    /**
     * Converts a given letter to what number position it is alphabetically
     * @param col Column position as letter(s)
     * @returns number position of column
     */
    static letterToNum(col: string): number {
        col = col.toUpperCase();
        let sum = 0;
        let digit = 0;
        let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (var i = col.length - 1; i >= 0; i--) {
            var colLetter = col.charAt(i)
            var letterIndex = letters.indexOf(colLetter) + 1
            sum = sum + (letterIndex * Math.pow(26, digit));
            digit = digit + 1;
        }
        return sum - 1;

    }

    /**
     * Converts a number to excel-style column number i.e. column 27 will be AA
     * @param num the number to convert into a column number.
     * @return the column number in letter representation
     */
    static numToLetters(num: number): string {
        let letters = '';
        while (num >= 0) {
            letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters;
            num = Math.floor(num / 26) - 1;
        }
        return letters;
    }

    /**
     * Checks if the positions are the same
     * @param pos1 coordinate of one of the position
     * @param pos2 coordinate of the other
     * @returns whether the two positions are the same
     */
    static posEqual(pos1: [posX: number, posY: number], pos2: [posX: number, posY: number]): boolean {
        if (pos1 === pos2) return true;
        if (pos1 == null || pos2 == null) return false;
        if (pos1.length !== pos2.length) return false;
        for (var i = 0; i < pos1.length; ++i) {
            if (pos1[i] !== pos2[i]) return false;
        }
        return true;
    }
}
