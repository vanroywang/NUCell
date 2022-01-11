
import { expect } from 'chai';
import { Sheet } from './Sheet';
import { Cell } from './Cell';
import Utils from './Util';
import { evaluate } from 'mathjs';
describe('Backend tests', (): void => {
  let sheet: Sheet;

  beforeEach(() => {
    sheet = new Sheet(100, 100);

  });

  describe('get number of column', () => {
    it('should get number of column in the sheet correctly', (): void => {
      expect(sheet.getNumOfColumn()).to.equal(100);
    });
    it('should get number of column in the sheet correctly after a column deletion', (): void => {
      sheet.deleteColumn(1);
      expect(sheet.getNumOfColumn()).to.equal(99);
    });
    it('should get number of column in the sheet correctly after multiple column deletions', (): void => {
      for (let i = 0; i < 5; i++) {
        sheet.deleteColumn(1);
      }
      expect(sheet.getNumOfColumn()).to.equal(95);
    });
    it('should get number of column in the sheet correctly after adding a column', (): void => {
      sheet.addColumn(3);
      expect(sheet.getNumOfColumn()).to.equal(101);
    });
    it('should get number of column in the sheet correctly after adding multiple columns', (): void => {
      for (let i = 0; i < 5; i++) {
        sheet.addColumn(3);
      }
      expect(sheet.getNumOfColumn()).to.equal(105);
    });
  });

  describe('get number of row', () => {
    it('should get number of row in the sheet correctly', (): void => {
      expect(sheet.getNumOfRow()).to.equal(100);
    });
    it('should get number of row in the sheet correctly after a row deletion', (): void => {
      sheet.deleteRow(1);
      expect(sheet.getNumOfRow()).to.equal(99);
    });
    it('should get number of row in the sheet correctly after multiple row deletions', (): void => {
      for (let i = 0; i < 5; i++) {
        sheet.deleteRow(1);
      }
      expect(sheet.getNumOfRow()).to.equal(95);
    });
    it('should get number of row in the sheet correctly after adding a row', (): void => {
      sheet.addRow(3);
      expect(sheet.getNumOfRow()).to.equal(101);
    });
    it('should get number of row in the sheet correctly after adding multiple rows', (): void => {
      for (let i = 0; i < 5; i++) {
        sheet.addRow(3);
      }
      expect(sheet.getNumOfRow()).to.equal(105);
    });
  });


  describe('evaluate empty string', () => {
    it('could return undefined', (): void => {
      expect(evaluate("")).to.equal(undefined);
    });
  });

  describe('sheet: num to letter and letter to num', () => {
    it('should handle num to letter"', (): void => {
      expect(Utils.letterToNum("AA")).to.equal(26);
    });

    it('should handle num to letter A"', (): void => {
      expect(Utils.letterToNum("A")).to.equal(0);
    });

    it('should handle num to letter B"', (): void => {
      expect(Utils.letterToNum("B")).to.equal(1);
    });

  });
  describe('delete row', () => {
    describe('should correctly delete a row without reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 0);
      sheet.changeCellContent("1", 1, 0);
      sheet.changeCellContent("2", 2, 0);
      sheet.changeCellContent("3", 3, 0);
      sheet.deleteRow(2);
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("0");
      });
      it('A1 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('A2 raw content should not change"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("1");
      });
      it('A2 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('Previous A3 should be deleted and the new raw content is 3"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("3");
      });
      it('Previous A3 should be deleted and the new evaluated content is 3"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("");
      });
      it('D1 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete the end row"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 98, 0);
      sheet.changeCellContent("1", 99, 0);
      sheet.deleteRow(99);
      it('second to last row raw content should not change"', (): void => {
        expect(sheet.getRawCell(98, 0)).to.equal("0");
      });
      it('second to last row evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(98, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('number of rows should be 99"', (): void => {
        expect(sheet.getNumOfRow()).to.equal(99);
      });

    });

    describe('should correctly delete a row with reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A3) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.deleteRow(1);
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(A2) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('Previous A2 raw content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("2");
      });
      it('Previous A2 eval content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A3 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("3");
      });
      it('A3 evaluated content now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('A4 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("");
      });
      it('A4 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete a row with reference except no content should change (not affected by deleted row)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(B1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.deleteRow(1);
      it('A1 raw content should not change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(B1) + 1");
      });
      it('Previous A2 raw content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("2");
      });
      it('A3 raw content now should equal what A4 was', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("3");
      });
      it('A4 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("");
      });

    });

    describe('should correctly delete a row that is directly referenced"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.deleteRow(1);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('Previous A2 raw content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("2");
      });
      it('A3 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("3");
      });
      it('A4 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("");
      });

    });

    describe('should correctly delete a row that is directly referenced - two references (one dependent on the other)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("= REF(A3)", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.deleteRow(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('A2 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A2 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('Previous A3 raw content should be deleted and now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("3");
      });
      it('Previous A3 evaluated content should be deleted and now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('A4 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("");
      });
      it('A4 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("");
      });

    });

    it('should correctly delete a row that is directly referenced - two references (one dependent on the other) "', (): void => {
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("= REF(A3)", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");

    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted"', (): void => {
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(1);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. SUM Case"', (): void => {
      sheet.changeCellContent("= SUM(A2, A3, A4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(1);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    describe('should correctly delete a row with reference (SUM) and change all references (list case)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3, A4, A5) + 1", 1, 0);//A2
      sheet.deleteRow(0); // Delete row 1
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= SUM(A2, A3, A4) + 1");
      });
      it('A1 evaluated content should still equal 1"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('Previous A2 raw content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('Previous A2 evaluated content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete a row with reference (SUM) and change all references (range case)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3:A5) + 1", 1, 0);//A2
      sheet.deleteRow(0); // Delete row 1
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= SUM(A2:A4) + 1");
      });
      it('A1 evaluated content should still equal 1"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('Previous A2 raw content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('Previous A2 evaluated content should be deleted and now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. SUM Case with range of values"', (): void => {
      sheet.changeCellContent("= SUM(A2:C4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(1);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });
    it('should handle multiply negative numbers in evaluate"', (): void => {
      sheet.changeCellContent("= -1 * -2", 0, 0);//A1
      expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
    });
    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. SUM Case with range of values. Deleting a value in the middle of range"', (): void => {
      sheet.changeCellContent("= SUM(A2:C4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(2); // DELETE THE THIRD ROW
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. AVG Case', (): void => {
      sheet.changeCellContent("= AVG(A2, A3, A4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(1);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. AVG Case with range of values"', (): void => {
      sheet.changeCellContent("= AVG(A2:C4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(1);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a row with reference and throw error, since the exact row of reference is deleted. AVG Case with range of values. Deleting a value in the middle of range"', (): void => {
      sheet.changeCellContent("= AVG(A2:C4) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.deleteRow(2); // DELETE THE THIRD ROW
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });
  });

  describe('delete column', () => {
    describe('should correctly delete a column without a reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(1);
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("0");
      });
      it('A1 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('Previous B1 raw content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("2");
      });
      it('Previous B1 eval content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });
      it('C1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('Previous C1 eval content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
      it('D1 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete a column with reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(C1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(1);
      it('A1 raw content should update reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(B1) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('Previous B1 raw content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("2");
      });
      it('Previous B1 eval content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });
      it('C1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('Previous C1 eval content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
      it('D1 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete the end column"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 98);
      sheet.changeCellContent("1", 0, 99);
      sheet.deleteColumn(99);
      it('second to last col raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 98)).to.equal("0");
      });
      it('second to last col evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 98).getCellEvaluatedContent()).to.equal("0");
      });
      it('number of columns should be 99"', (): void => {
        expect(sheet.getNumOfColumn()).to.equal(99);
      });

    });

    describe('should correctly delete a column with reference except no content should change (not affected by deleted column)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(1);
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(A2) + 1");
      });
      it('A1 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('Previous B1 raw content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("2");
      });
      it('Previous B1 evaluated content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });
      it('C1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('C1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
      it('D1 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete a column that is directly referenced"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(C1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('B1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("1");
      });
      it('Previous C1 raw content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
    });

    describe('should correctly delete a column that is directly referenced - two references (one dependent on the other)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(B1) + 1", 0, 0);//A1
      sheet.changeCellContent("= REF(C1)", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('B1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("ERROR: invalid reference.");
      });
      it('B1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('C1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('C1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
      it('D1 evaluated content should be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("");
      });
    });

    describe('should correctly delete a column that is directly referenced - SUM Case"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(C1, D1, E1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('Previous B1 raw content should be deleted and now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('C1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });

    });

    describe('should correctly delete a column that is directly referenced - SUM Case with range"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(C1:E1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('B1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("1");
      });
      it('Previous C1 raw content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });

    });


    it('should correctly delete a column that is directly referenced - SUM Case with range- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= SUM(C1:E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");

    });

    it('should correctly delete a column that is directly referenced - SUM Case with list- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= SUM(C1, D1, E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");

    });

    describe('should correctly delete a column that is directly referenced - SUM Case with list"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(C1, D1, E1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('Previous C1 raw content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });

    });

    describe('should correctly delete a column that is directly referenced - SUM Case with range"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(C1:E1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.deleteColumn(2);
      it('A1 raw content should show an error for invalid reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
      });
      it('A1 evaluated content should show an error for invalid reference"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid reference.");
      });
      it('Previous C1 raw content should be deleted and now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("3");
      });
      it('D1 raw content should be empty"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("");
      });
    });


    it('should correctly delete a column that is directly referenced - SUM Case with range- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= SUM(C1:E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a column that is directly referenced - SUM Case with list- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= SUM(C1, D1, E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a column that is directly referenced - AVG Case with range- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= AVG(C1:E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a column that is directly referenced - AVG Case with list- column in middle of range deleted"', (): void => {
      sheet.changeCellContent("= AVG(C1, D1, E1) + 1", 0, 0);//A1
      sheet.deleteColumn(3);
      expect(sheet.getRawCell(0, 0)).to.equal("ERROR: invalid reference.");
    });

    it('should correctly delete a column with reference (SUM) and change all references (list case)"', (): void => {
      sheet.changeCellContent("= SUM(C1, D1, E1) + 1", 0, 1);//B1
      sheet.deleteColumn(0);
      expect(sheet.getRawCell(0, 0)).to.equal("= SUM(B1, C1, D1) + 1");
    });

    it('should correctly delete a row with reference (SUM) and change all references (range case)"', (): void => {
      sheet.changeCellContent("= SUM(C1:E1) + 1", 0, 1);//B1
      sheet.deleteColumn(0);
      expect(sheet.getRawCell(0, 0)).to.equal("= SUM(B1:D1) + 1");
    });

    it('should correctly delete a row with reference (AVG) and change all references (list case)"', (): void => {
      sheet.changeCellContent("= AVG(C1, D1, E1) + 1", 0, 1);//B1
      sheet.deleteColumn(0);
      expect(sheet.getRawCell(0, 0)).to.equal("= AVG(B1, C1, D1) + 1");
    });

    it('should correctly delete a row with reference (AVG) and change all references (range case)"', (): void => {
      sheet.changeCellContent("= AVG(C1:E1) + 1", 0, 1);//B1
      sheet.deleteColumn(0);
      expect(sheet.getRawCell(0, 0)).to.equal("= AVG(B1:D1) + 1");
    });

  });

  describe('add row', () => {

    describe('should correctly add a row without a reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.addRow(1);
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("0");
      });
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('Previous A2 raw content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('Previous A2 evaluated content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content now should equal what A2 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("1");
      });
      it('A3 evaluated content now should equal what A2 was"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('A4 raw content now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("2");
      });
      it('A4 evaluated content now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A5 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(4, 0)).to.equal("3");
      });
      it('A5 evaluated content now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(4, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });


    describe('should correctly add a row with reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A3) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.addRow(1);
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(A4) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('Previous A2 raw content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('Previous A2 evaluated content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content now should equal what A2 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("1");
      });
      it('A3 evaluated content now should equal what A2 was"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('A4 raw content now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("2");
      });
      it('A4 evaluated content now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A5 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(4, 0)).to.equal("3");
      });
      it('A5 evaluated content now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(4, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a row on end row"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 98, 0);
      sheet.changeCellContent("1", 99, 0);
      sheet.addRow(99);
      it('Column 98 raw content should not change"', (): void => {
        expect(sheet.getRawCell(98, 0)).to.equal("0");
      });
      it('Column 98 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(98, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('Previous Column 99 raw content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getRawCell(99, 0)).to.equal("");
      });
      it('Previous Column 99 evaluated content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(99, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('Column 100 raw content now should equal what Column 99 was"', (): void => {
        expect(sheet.getRawCell(100, 0)).to.equal("1");
      });
      it('Column 100 evaluated content now should equal what Column 99 was"', (): void => {
        expect(sheet.getCellAtPosition(100, 0).getCellEvaluatedContent()).to.equal("1");
      });
    });

    describe('should correctly add a row with two references (one dependent on the other)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(A2) + 1", 0, 0);//A1
      sheet.changeCellContent("= REF(A3)", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.addRow(1);
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(A3) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('Previous A2 raw content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('Previous A2 evaluated content should be deleted and now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= REF(A4)");
      });
      it('A3 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A4 raw content now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("2");
      });
      it('A4 evaluated content now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A5 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(4, 0)).to.equal("3");
      });
      it('A5 evaluated content now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(4, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a row to the top of the sheet"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 0);//A1
      sheet.changeCellContent("1", 1, 0);//A2
      sheet.changeCellContent("2", 2, 0);//A3
      sheet.changeCellContent("3", 3, 0);//A4
      sheet.addRow(0);
      it('This is where the new row was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("");
      });
      it('This is where the new row was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("0");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('A3 raw content now should equal what A2 was"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("1");
      });
      it('A3 evaluated content now should equal what A2 was"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
      it('A4 raw content now should equal what A3 was"', (): void => {
        expect(sheet.getRawCell(3, 0)).to.equal("2");
      });
      it('A4 evaluated content now should equal what A3 was"', (): void => {
        expect(sheet.getCellAtPosition(3, 0).getCellEvaluatedContent()).to.equal("2");
      });
      it('A5 raw content now should equal what A4 was"', (): void => {
        expect(sheet.getRawCell(4, 0)).to.equal("3");
      });
      it('A5 evaluated content now should equal what A4 was"', (): void => {
        expect(sheet.getCellAtPosition(4, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a row with reference (SUM) and change all references (list)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3, A4, A5) + 1", 1, 0);//A2
      sheet.addRow(0); // Add row 1
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= SUM(A4, A5, A6) + 1");
      });
      it('A3 evaluated content should still equal 1"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
    });

    describe('should correctly add a row with reference (SUM) and change all references (list) (different columns)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3, B4, C5) + 1", 1, 0);//A2
      sheet.addRow(0); // Add row 1
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= SUM(A4, B5, C6) + 1");
      });
      it('A3 evaluated content should still equal 0"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });

    });

    describe('should correctly add a row with reference (SUM) and change all references (range)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3:A5) + 1", 1, 0);//A2
      sheet.addRow(0); // Add row 1
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= SUM(A4:A6) + 1");
      });
      it('A3 evaluated content should still equal 1"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
    });

    describe('should correctly add a row with reference (AVG) and change all references (list)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= AVG(A3, A4, A5) + 1", 1, 0);//A2
      sheet.addRow(0); // Add row 1
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= AVG(A4, A5, A6) + 1");
      });
      it('A3 evaluated content should still equal 0"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
    });


    describe('should correctly add a row with reference (AVG) and change all references (range)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= AVG(A3:A5) + 1", 1, 0);//A2
      sheet.addRow(0); // Add row 1
      it('A2 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("");
      });
      it('A2 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('A3 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(2, 0)).to.equal("= AVG(A4:A6) + 1");
      });
      it('A3 evaluated content should still equal 1"', (): void => {
        expect(sheet.getCellAtPosition(2, 0).getCellEvaluatedContent()).to.equal("1");
      });
    });

    it('should correctly add a row in between SUM list"', (): void => {
      sheet.changeCellContent("= SUM(A3, A4, A5) + 1", 1, 0);//A2
      sheet.addRow(3); // Add row 4
      expect(sheet.getRawCell(1, 0)).to.equal("= SUM(A3, A5, A6) + 1");
    });


    describe('should correctly add a row in between SUM range"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(A3:A5)", 1, 0);//A2
      sheet.addRow(3); // Add row 4
      sheet.changeCellContent("1", 2, 0);//A3
      sheet.changeCellContent("1", 3, 0);//A4
      sheet.changeCellContent("1", 4, 0);//A5
      sheet.changeCellContent("1", 5, 0);//A6
      it('A2 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(1, 0)).to.equal("= SUM(A3:A6)");
      });
      it('A2 evaluated content should still equal 5 since it is now looking at 4 cells"', (): void => {
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("4");
      });
    });
  });

  describe('add column', () => {
    describe('should correctly add a column without a reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(1);
      it('A1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("0");
      });
      it('A1 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });
      it('This is where the new column was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("");
      });
      it('This is where the new column was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column with reference"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(C1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(1);
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(D1) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column to end column of sheet"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("0", 0, 98);
      sheet.changeCellContent("1", 0, 99);
      sheet.addColumn(99);
      it('second to last column raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 98)).to.equal("0");
      });
      it('second to last column evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 98).getCellEvaluatedContent()).to.equal("0");
      });
      it('This is where the new column was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 99)).to.equal("");
      });
      it('This is where the new column was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 99).getCellEvaluatedContent()).to.equal("");
      });
      it('Column 100 raw content now should equal what Column 99 was"', (): void => {
        expect(sheet.getRawCell(0, 100)).to.equal("1");
      });
      it('Column 100 evaluated content now should equal what Column 99 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 100).getCellEvaluatedContent()).to.equal("1");
      });
    });

    describe('should correctly add a column with two references (one dependent on the other)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= REF(B1) + 1", 0, 0);//A1
      sheet.changeCellContent("= REF(C1)", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.addColumn(1);
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= REF(C1) + 1");
      });
      it('A1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
      it('This is where the new column was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("");
      });
      it('This is where the new column was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("");
      });
      it('C1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("= REF(D1)");
      });
      it('C1 evaluated content should still equal 2"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("2");
      });
    });

    describe('should correctly add a col to the leftmost of the sheet"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("10", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(0);
      it('This is where the new column was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("");
      });
      it('This is where the new column was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
      });
      it('B1 raw content now should equal what A1 was"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("10");
      });
      it('B1 evaluated content now should equal what A1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("10");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column with reference (SUM) and change all references (list)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(B1, C1, D1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(0);
      it('B1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("= SUM(C1, D1, E1) + 1");
      });
      it('B2 evaluated content should still equal 7"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("7");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column with reference (SUM) and change all references (range)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(B1:D1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(0);
      it('B1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("= SUM(C1:E1) + 1");
      });
      it('B1 evaluated content should still equal 7"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("7");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column with reference (AVG) and change all references (list)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= AVG(B1, C1, D1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(0);
      it('B1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("= AVG(C1, D1, E1) + 1");
      });
      it('B1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("3");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column with reference (AVG) and change all references (range)"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= AVG(B1:D1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(0);
      it('B1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("= AVG(C1:E1) + 1");
      });
      it('B1 evaluated content should still equal 3"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("3");
      });
      it('C1 raw content now should equal what B1 was"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("1");
      });
      it('C1 evaluated content now should equal what B1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("1");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('should correctly add a column in between SUM range"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(B1:D1) + 1", 0, 0);//A1
      sheet.addColumn(2); // add on col C
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("1", 0, 2);//C1
      sheet.changeCellContent("1", 0, 3);//D1
      sheet.changeCellContent("1", 0, 4);//E1
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= SUM(B1:E1) + 1");
      });
      it('A1 evaluated content should still equal 5 since it is now looking at 4 cells"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("5");
      });
    });

    describe('should correctly add a column in between SUM list"', (): void => {
      let sheet = new Sheet(100, 100);
      sheet.changeCellContent("= SUM(B1, C1, D1) + 1", 0, 0);//A1
      sheet.changeCellContent("1", 0, 1);//B1
      sheet.changeCellContent("2", 0, 2);//C1
      sheet.changeCellContent("3", 0, 3);//D1
      sheet.addColumn(2); // add on col C
      it('A1 raw content should change reference"', (): void => {
        expect(sheet.getRawCell(0, 0)).to.equal("= SUM(B1, D1, E1) + 1");
      });
      it('A1 evaluated content should still equal 7"', (): void => {
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("7");
      });
      it('B1 raw content should not change"', (): void => {
        expect(sheet.getRawCell(0, 1)).to.equal("1");
      });
      it('B1 evaluated content should not change"', (): void => {
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("1");
      });
      it('This is where the new column was added so the raw content now should now be empty"', (): void => {
        expect(sheet.getRawCell(0, 2)).to.equal("");
      });
      it('This is where the new column was added so the evaluated content now should now be empty"', (): void => {
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("");
      });
      it('D1 raw content now should equal what C1 was"', (): void => {
        expect(sheet.getRawCell(0, 3)).to.equal("2");
      });
      it('D1 evaluated content now should equal what C1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("2");
      });
      it('E1 raw content now should equal what D1 was"', (): void => {
        expect(sheet.getRawCell(0, 4)).to.equal("3");
      });
      it('E1 evaluated content now should equal what D1 was"', (): void => {
        expect(sheet.getCellAtPosition(0, 4).getCellEvaluatedContent()).to.equal("3");
      });
    });

  });

  describe('sheet: evaluate function', () => {
    describe('sheet: assign eval cont ', () => {
      it('should handle basic setting eval cont"', (): void => {
        sheet.changeCellContent("hi", 0, 0); //A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("hi");
      });
      it('should handle basic setting eval cont- number"', (): void => {
        sheet.changeCellContent("3", 0, 0); //A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle basic setting eval cont- number"', (): void => {
        sheet.changeCellContent("= 3", 0, 0); //A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });

    describe('sheet: evaluation edge cases', () => {
      it('should handle just equal sign given"', (): void => {
        sheet.changeCellContent("=", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: No function given after =");
      });

      it('should handle just equal sign given with spaces after"', (): void => {
        sheet.changeCellContent("=    ", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: No function given after =");
      });

      it('should handle just equal sign given with spaces before"', (): void => {
        sheet.changeCellContent("  =", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: No function given after =");
      });

      it('should handle just equal sign given with spaces before and after"', (): void => {
        sheet.changeCellContent("  =", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: No function given after =");
      });
    });

    describe('sheet: add', () => {
      it('should handle add in evaluate"', (): void => {
        sheet.changeCellContent("= 1 + 2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle add negative numbers in evaluate"', (): void => {
        sheet.changeCellContent("= -1 + -2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-3");
      });

      it('should handle add 0s together in evaluate"', (): void => {
        sheet.changeCellContent("= 0 + 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });

      it('should handle add decimals together in evaluate"', (): void => {
        sheet.changeCellContent("= 1.1 + 2.1", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3.2");
      });

      it('should handle add large decimals together in evaluate"', (): void => {
        sheet.changeCellContent("= 1.1 + 2.19999999999", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3.3");
      });
    });

    describe('sheet: subtract', () => {
      it('should handle subtract in evaluate"', (): void => {
        sheet.changeCellContent("= 1 - 2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-1");
      });

      it('should handle subtract negative numbers in evaluate"', (): void => {
        sheet.changeCellContent("= -1 - -2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");

      });

      it('should handle subtract 0s together in evaluate"', (): void => {
        sheet.changeCellContent("= 0 - 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");

      });

      it('should handle subtract decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 1.1 - 2.1", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-1");

      });
    });

    describe('sheet: multiply', () => {
      it('should handle multiply in evaluate"', (): void => {
        sheet.changeCellContent("= 1 * 2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
      });

      it('should handle multiply negative numbers in evaluate"', (): void => {
        sheet.changeCellContent("= -1 * -2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
      });

      it('should handle multiply 0s together in evaluate"', (): void => {
        sheet.changeCellContent("= 0 * 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });

      it('should handle multiply decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 1.1 * 2.1", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2.31");
      });

      it('should handle multiply large decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 1.1 * 2.32156", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2.554");
      });

      it('should handle multiply larger decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 1.123 * 3.14159", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3.528");
      });

      it('should handle multiply large numbers together in evaluate"', (): void => {
        sheet.changeCellContent("= 1213 * 123123", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("149348199");
      });

      it('should handle multiply large numbers together in evaluate (larger case)"', (): void => {
        sheet.changeCellContent("= 123456789 * 10000000000", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1234567890000000000");
      });
    });

    describe('sheet: divide', () => {
      it('should handle divide in evaluate"', (): void => {
        sheet.changeCellContent("= 1 / 2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0.5");
      });

      it('should handle divide negative numbers in evaluate"', (): void => {
        sheet.changeCellContent("= -1 / -2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0.5");
      });

      it('should handle divide 0s in evaluate"', (): void => {
        sheet.changeCellContent("= 0 / 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Zero divided By Zero");
      });

      it('should handle divide by 0 in evaluate"', (): void => {
        sheet.changeCellContent("= 1 / 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Divide By Zero");
      });

      it('should handle divide decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 1.5 / 2.0 ", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0.75");
      });

      it('should handle divide large decimals in evaluate"', (): void => {
        sheet.changeCellContent("= 22 / 7 ", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3.143");
      });
    });

    describe('sheet: exponents', () => {
      it('should handle exponents in evaluate"', (): void => {
        sheet.changeCellContent("= 2^2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4");
      });

      it('should handle exponents with negative numbers in evaluate"', (): void => {
        sheet.changeCellContent("= -1^-1", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-1");
      });

      it('should handle negative exponents"', (): void => {
        sheet.changeCellContent("= 2^-1", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0.5");
      });

      it('should handle exponent 0 to the 0th power in evaluate"', (): void => {
        sheet.changeCellContent("= 0^0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");
      });

      it('should handle decimals in evaluate exponent"', (): void => {
        sheet.changeCellContent("= 1^1.5", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("1");
      });

      it('should handle decimals in evaluate exponent as base"', (): void => {
        sheet.changeCellContent("= 1.5^2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2.25");
      });

      it('should handle exponent before divide', (): void => {
        sheet.changeCellContent("= 9^1/2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4.5");
      });
      it('should handle fraction as exponent"', (): void => {
        sheet.changeCellContent("= 9^(1/2)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });
    });


    describe('sheet: PEMDAS', () => {
      it('should handle multiple addition statements"', (): void => {
        sheet.changeCellContent("= 2 + 2 + 2 + 4 + 6", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("16");
      });

      it('should handle multiple subtraction statements"', (): void => {
        sheet.changeCellContent("= 10 - 2 - 2 - 2 - 4 - 6", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-6");
      });

      it('should handle multiple multiplication statements"', (): void => {
        sheet.changeCellContent("= 2 * 6 * 4", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("48");
      });

      it('should handle multiple division statements"', (): void => {
        sheet.changeCellContent("= 100 / 10 / 2 / 1 ", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("5");
      });

      it('should handle multiple exponent statements"', (): void => {
        sheet.changeCellContent("= (2^2)^2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("16");
      });

      it('should handle multiple different statements"', (): void => {
        sheet.changeCellContent("= 2 + 2 * 2 - 4 / 4", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("5");
      });

      it('should handle multiple different statements divided by 0"', (): void => {
        sheet.changeCellContent("= 2 + 2 * 2 - 4 / 0", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Divide By Zero");
      });

      it('should handle multiple different statements and exponents"', (): void => {
        sheet.changeCellContent("= 2 + 2 * 2 - 4 + 4^2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("18");
      });

      it('should handle multiple different statements with parenthesis"', (): void => {
        sheet.changeCellContent("= 2 + 2 * 2 - 4 + (4 + 10)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("16");
      });

      it('should handle multiple different statements with parenthesis and brackets"', (): void => {
        sheet.changeCellContent("= (2 + 2) * 2 - 4 + (4 + 10)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("18");
      });

      it('should handle multiple different statements not separated by spaces"', (): void => {
        sheet.changeCellContent("=2+2*2-4", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
      });

      it('should handle multiple different statements not separated by spaces with parenthesis"', (): void => {
        sheet.changeCellContent("=2+2*2-4+(4+10)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("16");
      });

    });

    describe('sheet: REF', () => {
      it('should handle basic REF without any arithmetic', (): void => {
        sheet.changeCellContent("= REF(B1)", 0, 0);//A1
        sheet.changeCellContent("3", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle REF function with a string given', (): void => {
        sheet.changeCellContent("= REF('hello')", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle basic REF without any arithmetic reverse order', (): void => {
        sheet.changeCellContent("3", 0, 0);//A1
        sheet.changeCellContent("= REF(A1)", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("3");
      });
      it('should handle basic REF', (): void => {
        sheet.changeCellContent("= REF(B1) + 1", 0, 0);//A1
        sheet.changeCellContent("3", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4");
      });

      it('should handle basic REF where cell it points to is blank', (): void => {
        sheet.changeCellContent("= REF(B1) + 2", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
      });

      it('should handle basic REF where cell it points to is blank (and no operation is done)', (): void => {
        sheet.changeCellContent("= REF(B1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });

      it('should handle basic REF, reverse order from test above', (): void => {
        sheet.changeCellContent("3", 0, 0);//A1
        sheet.changeCellContent("= REF(A1) + 1", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("4");
      });

      it('should handle recursive REF', (): void => {
        sheet.changeCellContent("3", 0, 0);//A1
        sheet.changeCellContent("= REF(A1) + 1", 0, 1);//B1
        sheet.changeCellContent("= REF(B1) + 2", 0, 2);//C1
        sheet.changeCellContent("= REF(C1)", 0, 3);//C1
        sheet.changeCellContent("6", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 3).getCellEvaluatedContent()).to.equal("9");
      });

      it('should handle empty REF', (): void => {
        sheet.changeCellContent("= REF()", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle REF function with reference to a string', (): void => {
        sheet.changeCellContent("= REF(B1)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("hello");
      });
    });

    describe('sheet: SUM', () => {
      it('should handle SUM function with nothing given inside parenthesis', (): void => {
        sheet.changeCellContent("= SUM()", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });
      it('should handle SUM function with a string given', (): void => {
        sheet.changeCellContent("= SUM('hello')", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle SUM function with 1 value (not a cell reference) given inside parenthesis', (): void => {
        sheet.changeCellContent("= SUM(4)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle SUM function with value that are not cell references given inside parenthesis', (): void => {
        sheet.changeCellContent("= SUM(4, 10)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell positions");
      });

      it('should handle SUM function with 1 reference given', (): void => {
        sheet.changeCellContent("= SUM(B1)", 0, 0);//A1
        sheet.changeCellContent("= 4", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4");
      });

      it('should handle SUM function with reference to string', (): void => {
        sheet.changeCellContent("= SUM(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: SUM cannot perform on non-numbers");
      });


      it('should handle SUM function with references to cells', (): void => {
        sheet.changeCellContent("= SUM(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("6");
      });

      it('should handle SUM function with references to list of cells', (): void => {
        sheet.changeCellContent("= SUM(B1:C2)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("3", 1, 1);//B2
        sheet.changeCellContent("5", 1, 2);//C2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("14");
      });

      it('should handle SUM function with references to list of cells, opposite order', (): void => {
        sheet.changeCellContent("= SUM(C2:B1)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("3", 1, 1);//B2
        sheet.changeCellContent("5", 1, 2);//C2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("14");
      });

      it('should handle SUM function with references to empty cells', (): void => {
        sheet.changeCellContent("= SUM(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });

      it('should handle SUM function with references to one empty cell', (): void => {
        sheet.changeCellContent("= SUM(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4");
      });
    });

    describe('sheet: AVG', () => {
      it('should handle AVG function with nothing given inside parenthesis', (): void => {
        sheet.changeCellContent("= AVG()", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle AVG function with a string given', (): void => {
        sheet.changeCellContent("= AVG('hello')", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle AVG function with reference to string', (): void => {
        sheet.changeCellContent("= AVG(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: AVG cannot perform on non-numbers");
      });

      it('should handle AVG function with 1 value (not a cell reference) given inside parenthesis', (): void => {
        sheet.changeCellContent("= AVG(4)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle AVG function with value that are not cell references given inside parenthesis', (): void => {
        sheet.changeCellContent("= AVG(4, 10)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell positions");
      });

      it('should handle AVG function with 1 reference given', (): void => {
        sheet.changeCellContent("= AVG(B1)", 0, 0);//A1
        sheet.changeCellContent("= 4", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4");
      });

      it('should handle AVG function with reference to string', (): void => {
        sheet.changeCellContent("= AVG(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: AVG cannot perform on non-numbers");
      });


      it('should handle AVG function with references to cells', (): void => {
        sheet.changeCellContent("= AVG(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle AVG function with references to list of cells', (): void => {
        sheet.changeCellContent("= AVG(B1:C2)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("3", 1, 1);//B2
        sheet.changeCellContent("3", 1, 2);//C2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle AVG function with references to list of cells, opposite order', (): void => {
        sheet.changeCellContent("= AVG(C2:B1)", 0, 0);//A1
        sheet.changeCellContent("2", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("3", 1, 1);//B2
        sheet.changeCellContent("3", 1, 2);//C2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("3");
      });

      it('should handle AVG function with references to empty cells', (): void => {
        sheet.changeCellContent("= AVG(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("0");
      });

      it('should handle AVG function with references to one empty cell', (): void => {
        sheet.changeCellContent("= AVG(B1, C1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("2");
      });
    });

    describe('sheet: should handle combinations of REF, SUM, and AVG', () => {
      it('should handle multiple REFs', (): void => {
        sheet.changeCellContent("= REF(B1) - REF(C1) * REF(D1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("4", 0, 3);//D1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-16");
      });

      it('should handle multiple REFs with additional number', (): void => {
        sheet.changeCellContent("3", 0, 0);//A1
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= REF(A1) - REF(A2) + 1", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });

      it('should handle multiple SUMs', (): void => {
        sheet.changeCellContent("= SUM(B1, D1, C1) + SUM(E1, F1)", 0, 0);//A1
        sheet.changeCellContent("", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("4", 0, 3);//D1
        sheet.changeCellContent("-3", 0, 4);//E1
        sheet.changeCellContent("4", 0, 5);//D1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("9");
      });

      it('should handle multiple AVGs', (): void => {
        sheet.changeCellContent("= AVG(B1, D1, C1) + AVG(E1, F1)", 0, 0);//A1
        sheet.changeCellContent("4", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("4", 0, 3);//D1
        sheet.changeCellContent("-3", 0, 4);//E1
        sheet.changeCellContent("4", 0, 5);//D1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("4.5");
      });

      it('should handle multiple different ref functions', (): void => {
        sheet.changeCellContent("= AVG(B1, D1, C1) + SUM(E1:G2) + REF(F1)", 0, 0);//A1
        sheet.changeCellContent("4", 0, 1);//B1
        sheet.changeCellContent("4", 0, 2);//C1
        sheet.changeCellContent("4", 0, 3);//D1
        sheet.changeCellContent("-3", 0, 4);//E1
        sheet.changeCellContent("4", 0, 5);//F1
        sheet.changeCellContent("7", 0, 6);//G1
        sheet.changeCellContent("3", 1, 6);//G2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("19");
      });

      it('should send an error when there is a circular reference', (): void => {
        sheet.changeCellContent("= REF(B1)", 0, 0);//A1
        sheet.changeCellContent("= REF(C1)", 0, 1);//B1
        sheet.changeCellContent("= REF(A1)", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 2).getCellEvaluatedContent()).to.equal("ERROR: circular reference failed to set content");
      });

      it('should not set any value when there is a circular reference', (): void => {
        sheet.changeCellContent("= REF(B1)", 0, 0);//A1
        sheet.changeCellContent("= REF(C1)", 0, 1);//B1
        sheet.changeCellContent("= REF(A1)", 0, 2);//C1
        expect(sheet.getCellAtPosition(0, 2).getRawContent()).to.equal("");
      });

    });

    describe('sheet: String concat', () => {
      it('should concat the two strings', (): void => {
        sheet.changeCellContent('= "zip" + "zap"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("zipzap");
      });

      it('should concat the two strings with symbols inside them', (): void => {
        sheet.changeCellContent('= "-" + "/"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("-/");
      });

      it('if it has incorrect operator it just sets cells content to whatever is after the equal sign (as a string)', (): void => {
        sheet.changeCellContent('= "zip" - "zap"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal('"zip" - "zap"');
      });

      it('should concat the multiple strings', (): void => {
        sheet.changeCellContent('= "zip" + "zap" + "hello"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("zipzaphello");
      });

      it('should concat the empty strings', (): void => {
        sheet.changeCellContent('= "" + "" + ""', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
      });

      it('should concat the empty string and non-empty string', (): void => {
        sheet.changeCellContent('= "" + "hello"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("hello");
      });

      it('should concat the empty string and non-empty string with ref', (): void => {
        sheet.changeCellContent('= REF(A1) + "hello"', 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: Type mismatch");
      });

      it('should concat the REFs to strings', (): void => {
        sheet.changeCellContent("= REF(B1) + REF(B2)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        sheet.changeCellContent("World", 1, 1);//B2
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("helloWorld");
      });

      it('should concat with numbers in quotes', (): void => {
        sheet.changeCellContent('= "5" + "6"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("56");
      });

      it('should concat strings without quotation marks', (): void => {
        sheet.changeCellContent('= hello + hi', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("hellohi");
      });

      it('should concat with only one string given', (): void => {
        sheet.changeCellContent('= "hello"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal('"hello"');
      });

      it('should concat with only one string given without quoatation marks', (): void => {
        sheet.changeCellContent('= hello', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal('hello');
      });

      it('should concat with double quotations around word', (): void => {
        sheet.changeCellContent('= ""hello""', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal('""hello""');
      });

      it('should concat with double quotations around word being concatenated', (): void => {
        sheet.changeCellContent('= ""zip"" + ""zap""', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal('"zip""zap"');
      });

      it('should concat multiple strings', (): void => {
        sheet.changeCellContent('= "zip" + "zap" + "zip"', 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("zipzapzip");
      });
    });

    describe('sheet: Errors with mismatched types', () => {
      it('should throw an error when trying to add mismatched types', (): void => {
        sheet.changeCellContent("= 2 + 2 + 2 + 4 + 6 + hello", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Type mismatch");
      });
      it('should throw an error when trying to add reference with mismatched types', (): void => {
        sheet.changeCellContent("= 2 + 2 + 2 + 4 + 6 + REF(B1)", 0, 0);//A1
        sheet.changeCellContent("hello", 0, 1);//B1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Type mismatch");
      });
      it('should set cell equal to content even if it contains nums and letters ', (): void => {
        sheet.changeCellContent("= hello 1 world", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("hello 1 world");
      });
    });

    describe('sheet: incorrect functions', () => {
      it('should correctly set cell to have error if function is invalid (lowercase REF)', (): void => {
        sheet.changeCellContent("= ref(B1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should correctly set cell to have error if function is invalid (lowercase SUM)', (): void => {
        sheet.changeCellContent("= sum(B1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should correctly set cell to have error if function is invalid (lowercase AVG)', (): void => {
        sheet.changeCellContent("= avg(B1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should correctly set cell to have error if function is invalid- unknown function', (): void => {
        sheet.changeCellContent("= DIV(B1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

    });

    describe('sheet: clear works', () => {
      describe('should correctly clear a cell"', (): void => {
        let sheet = new Sheet(100, 100);
        sheet.changeCellContent("= 2 + 2 + 2 + 4 + 6 + hello", 0, 0);//A1
        sheet.clearCell(0, 0);
        it('should correctly clear the cells evaluated content', (): void => {
          expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
        });
        it('should correctly clear the cells raw content', (): void => {
          expect(sheet.getRawCell(0, 0)).to.equal("");
        });
      });

      describe('should correctly clear a cell with a ref"', (): void => {
        let sheet = new Sheet(100, 100);
        sheet.changeCellContent("= 2 + 2 + 2 + 4 + 6 + hello", 0, 0);//A1
        sheet.changeCellContent("= REF(A1)", 0, 1); //B1
        sheet.clearCell(0, 0);
        it('should correctly clear the cells evaluated content', (): void => {
          expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
        });
        it('should correctly clear the cells raw content', (): void => {
          expect(sheet.getRawCell(0, 0)).to.equal("");
        });
        it('the references evaluated content should be unaffected', (): void => {
          expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("0");
        });
        it('the references raw content should be unaffected', (): void => {
          expect(sheet.getRawCell(0, 1)).to.equal("= REF(A1)");
        });
      });

      describe('should correctly clear a cell that has another cell using it in a SUM function."', (): void => {
        let sheet = new Sheet(100, 100);
        sheet.changeCellContent("2", 0, 0);//A1
        sheet.changeCellContent("4", 1, 0);//A2
        sheet.changeCellContent("= SUM(A1, A2)", 0, 1); //B1
        sheet.clearCell(0, 0);
        it('should correctly clear the cells evaluated content', (): void => {
          expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
        });
        it('should correctly clear the cells raw content', (): void => {
          expect(sheet.getRawCell(0, 0)).to.equal("");
        });
        it('the references evaluated content should be unaffected', (): void => {
          expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("4");
        });
        it('the references raw content should be unaffected', (): void => {
          expect(sheet.getRawCell(0, 1)).to.equal("= SUM(A1, A2)");
        });
      });

      describe('should correctly clear a cell that has another cell using it in a AVG function."', (): void => {
        let sheet = new Sheet(100, 100);
        sheet.changeCellContent("2", 0, 0);//A1
        sheet.changeCellContent("4", 1, 0);//A2
        sheet.changeCellContent("= AVG(A1, A2)", 0, 1); //B1
        sheet.clearCell(0, 0);
        it('should correctly clear the cells evaluated content', (): void => {
          expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("");
        });
        it('should correctly clear the cells raw content', (): void => {
          expect(sheet.getRawCell(0, 0)).to.equal("");
        });
        it('the references evaluated content should be unaffected', (): void => {
          expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
        });
        it('the references raw content should be unaffected', (): void => {
          expect(sheet.getRawCell(0, 1)).to.equal("= AVG(A1, A2)");
        });
      });

    });

    describe('sheet: reference edge cases', () => {
      it('should set cells evaluated content to error if the reference is not in correct format', (): void => {
        sheet.changeCellContent("2", 0, 0);//A1
        sheet.changeCellContent("= REF(!A1)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should correctly set cell to have error if function is invalid- incorrect format inside parenthesis', (): void => {
        sheet.changeCellContent("= SUM(B1 + C1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should set cells evaluated content to error if the SUM reference is not in correct format', (): void => {
        sheet.changeCellContent("2", 0, 0);//A1
        sheet.changeCellContent("= SUM(!A1)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should set cells evaluated content to error if the AVG reference is not in correct format', (): void => {
        sheet.changeCellContent("2", 0, 0);//A1
        sheet.changeCellContent("= AVG(!A1)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should set cells evaluated content to error if the reference is not in correct format- backwards reference', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= REF(2A)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should set cells evaluated content to error if the reference is not in correct format- function inside reference', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= REF(2 + 1)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should work even if REF cell is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= REF(a2)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });

      it('should work even if SUM ref cell is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= SUM(a2)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });

      it('should work even if AVG ref cell is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= AVG(a2)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("2");
      });

      it('should show an error since ref is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= ref(A2)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should show an error since sum is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= sum(A2)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should show an error since avg is lower case', (): void => {
        sheet.changeCellContent("2", 1, 0);//A2
        sheet.changeCellContent("= avg(A2, A3)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: Invalid function.");
      });

      it('should set cells evaluated content to error if the reference is outside of the range of cells', (): void => {
        sheet.changeCellContent("= REF(A1000)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should set cells evaluated content to error if one of the SUM references is outside of the range of cells', (): void => {
        sheet.changeCellContent("= SUM(A1, A1000)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell positions");
      });

      it('should set cells evaluated content to error if one of the AVG references is outside of the range of cells', (): void => {
        sheet.changeCellContent("= AVG(A1, A1000)", 0, 1); //B1
        expect(sheet.getCellAtPosition(0, 1).getCellEvaluatedContent()).to.equal("ERROR: invalid cell positions");
      });

      it('should handle a reference to itself', (): void => {
        sheet.changeCellContent("= REF(A1)", 0, 0);//A1
        expect(sheet.getCellAtPosition(0, 0).getCellEvaluatedContent()).to.equal("ERROR: invalid cell position");
      });

      it('should handle a reference to a newly added cell', (): void => {
        sheet.addRow(1);
        sheet.changeCellContent("= REF(B2)", 1, 0);//A2
        sheet.changeCellContent("5", 1, 1);
        expect(sheet.getCellAtPosition(1, 0).getCellEvaluatedContent()).to.equal("5");
      });
    });


    describe('sheet: filter works', () => {
      it('should correctly create a list to filter on', (): void => {
        sheet.changeCellContent("city", 0, 0);//A1
        sheet.changeCellContent("boston", 1, 0);//A2
        sheet.changeCellContent("boston", 2, 0);//A3
        sheet.changeCellContent("salem", 3, 0);//A4
        sheet.changeCellContent("Boston", 4, 0);//A5
        sheet.changeCellContent("should not show up", 6, 0);//A7
        expect(sheet.getFilterList(0, 0)).to.eql(new Set(["boston", "salem", "Boston"]));
      });

      it('should correctly create a list to filter on- all cells empty', (): void => {
        expect(sheet.getFilterList(0, 0)).to.eql(new Set([]));
      });

      it('should correctly return the filtered column list', (): void => {
        sheet.changeCellContent("city", 0, 0);//A1
        sheet.changeCellContent("boston", 1, 0);//A2
        sheet.changeCellContent("boston", 2, 0);//A3
        sheet.changeCellContent("salem", 3, 0);//A4
        sheet.changeCellContent("Boston", 4, 0);//A5
        sheet.changeCellContent("should not show up", 6, 0);//A7
        expect(sheet.filterColumn("boston", 0, 0)).to.eql([1, 2]);
      });

      it('should correctly create an empty list', (): void => {
        sheet.changeCellContent("city", 0, 0);//A1
        sheet.changeCellContent("should not show up", 6, 0);//A7
        expect(sheet.getFilterList(0, 0)).to.eql(new Set([]));
      });
    });

  });

  describe('util tests', () => {
    it('should handle num to letter for AA"', (): void => {
      expect(Utils.letterToNum("AA")).to.equal(26);
    });

    it('should handle num to letter for A"', (): void => {
      expect(Utils.letterToNum("A")).to.equal(0);
    });

    it('should handle num to letter for B"', (): void => {
      expect(Utils.letterToNum("B")).to.equal(1);
    });

    it('should handle num to letter for AB"', (): void => {
      expect(Utils.letterToNum("AB")).to.equal(27);
    });

    it('should handle num to letters for 0', (): void => {
      expect(Utils.numToLetters(0)).to.equal("A")
    });

    it('should handle num to letters for 26', (): void => {
      expect(Utils.numToLetters(26)).to.equal("AA")
    });

    it('should handle num to letters for 27', (): void => {
      expect(Utils.numToLetters(27)).to.equal("AB")
    });

    it('should handle pos to excel format for A1', (): void => {
      expect(Utils.UIPositionToModelPosition("A1")).to.eql([0, 0])
    });

    it('should handle excel format to pos for D27', (): void => {
      expect(Utils.UIPositionToModelPosition("D27")).to.eql([26, 3])
    });

    it('should handle excel format to pos for an undefined pos', (): void => {
      expect(Utils.UIPositionToModelPosition("")).to.equal(undefined)
    });

    it('should handle excel format to pos for [0, 0]', (): void => {
      expect(Utils.loopThroughRangeOfPositions([0, 0], [1, 0])).to.eql([[0, 0], [1, 0]])
    });


    it('should handle excel format to pos for undefined positions', (): void => {
      expect(() => { Utils.loopThroughRangeOfPositions(undefined, undefined) }).to.throw("Position(s) undefined")
    });
  });



});
describe('Backend tests with smaller sheet', (): void => {
  let sheet: Sheet;

  beforeEach(() => {
    sheet = new Sheet(2, 2);
    sheet.changeCellContent("= AVG(B1:B2) + 1", 0, 0);//A1
    sheet.changeCellContent("1", 0, 1);//B1
    sheet.changeCellContent("2", 1, 0);//A2
  });

  describe('test getRawMatrixData', () => {
    it('should correctly return the matrix data', (): void => {
      expect(sheet.getRawMatrixData()).to.eql([["= AVG(B1:B2) + 1", "1"], ["2", ""]]);
    });

    it('should correctly return the matrix data on an empty sheet', (): void => {
      let emptySheet = new Sheet(0, 0);
      expect(emptySheet.getRawMatrixData()).to.eql([]);
    });
  });

  describe('change color', () => {
    it('should correctly change color', (): void => {
      sheet.changeColorAtCell(0, 0, "TESTCODE")
      expect(sheet.getCellAtPosition(0, 0).getColor()).to.eql("TESTCODE");
    });
  });

});

