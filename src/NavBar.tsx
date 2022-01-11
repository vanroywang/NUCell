import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {HexColorPicker} from "react-colorful";
import './NavBar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faFilter, faDownload, faPalette} from '@fortawesome/free-solid-svg-icons'
import {CSVLink} from 'react-csv'

import React from "react";

export function NavBar(props: any) {
    // These boolean values control whether certain buttons are disabled or not.
    const invalidCoordinate = props.appState.selectedCoordinate.includes(-1);
    const cellIsEmpty = props.appState.formulaBarContent.replace(/(\r\n|\n|\r)/gm, "") === "";
    const notEnoughRows = props.appState.numRows <= 1;
    const notEnoughColumns = props.appState.numColumns <= 1;

    /**
     * Clears a cell by putting a return character in its spot (this return character will automatically
     * be cleared when a user types in the cell).
     */
    const clearCell = () => {
        props.appState.sheet.changeCellContent(
            "\r", props.appState.selectedCoordinate[0], props.appState.selectedCoordinate[1]);
        props.appDispatch({type: "selectedCoordinate", payload: [-1, -1]});
    };

    /**
     * Adds a new column to both the sheet and to the visual columns based on the currently selected cell.
     */
    const addColumn = () => {
        props.appState.sheet.changeCellContent(
            props.appState.formulaBarContent,
            props.appState.selectedCoordinate[0],
            props.appState.selectedCoordinate[1]);

        props.appState.sheet.addColumn(props.appState.selectedCoordinate[1]);
        props.appDispatch({type: "numColumns", payload: props.appState.numColumns + 1});
    }

    /**
     * Removes a column from both the sheet and from the visual columns based on the currently selected cell.
     */
    const deleteColumn = () => {
        props.appState.sheet.deleteColumn(props.appState.selectedCoordinate[1]);

        if (props.appState.selectedCoordinate[1] === props.appState.numColumns - 1)
            props.appDispatch({type: "selectedCoordinate", payload: [-1, -1]});

        props.appDispatch({type: "numColumns", payload: props.appState.numColumns - 1});
    };

    /**
     * Adds a new row to both the sheet and to the visual row based on the currently selected cell.
     * It also updates filtered rows to accommodate for this added row.
     */
    const addRow = () => {
        props.appState.sheet.changeCellContent(
            props.appState.formulaBarContent,
            props.appState.selectedCoordinate[0],
            props.appState.selectedCoordinate[1]);

        props.appState.sheet.addRow(props.appState.selectedCoordinate[0]);
        props.appDispatch({type: "numRows", payload: props.appState.numRows + 1});

        let newHiddenRows: number[] = []
        for (let num of props.appState.hiddenRows) {
            if (num > props.appState.selectedCoordinate[0]) {
                newHiddenRows.push(num + 1);
            } else {
                newHiddenRows.push(num);
            }
        }

        props.appDispatch({type: "hiddenRows", payload: newHiddenRows});
    };

    /**
     * Removes a row from both the sheet and from the visual row based on the currently selected cell.
     * It also updates filtered rows to accommodate for this removed row.
     */
    const deleteRow = () => {
        props.appState.sheet.deleteRow(props.appState.selectedCoordinate[0]);
        props.appDispatch({type: "numRows", payload: props.appState.numRows - 1});

        if (props.appState.selectedCoordinate[0] === props.appState.numRows - 1)
            props.appDispatch({type: "selectedCoordinate", payload: [-1, -1]});

        let newHiddenRows: number[] = []
        for (let num of props.appState.hiddenRows) {
            if (num > props.appState.selectedCoordinate[0]) {
                newHiddenRows.push(num - 1);
            } else {
                newHiddenRows.push(num);
            }
        }

        props.appDispatch({type: "hiddenRows", payload: newHiddenRows});
    };

    /**
     * Changes the color value of a particular cell.
     * @param color The color as a hex value that the cell color should be changed to.
     */
    const changeCellColor = (color: string) => {
        const coord = [...props.appState.selectedCoordinate];
        props.appState.sheet.changeColorAtCell(
            props.appState.selectedCoordinate[0], props.appState.selectedCoordinate[1], color);
        props.appDispatch({type: "selectedCoordinate", payload: [-1, -1]});
        props.appDispatch({type: "selectedCoordinate", payload: coord});
    };

    return (
        <div>
            {/*Initiate bootstrap navbar.*/}
            <Navbar bg="dark" variant="dark" fixed="top">
                <Container>
                    <Navbar.Brand className="nu-cell-title">NU Cell</Navbar.Brand>
                    {/*Right-side buttons.*/}
                    <Nav className="ml-auto">
                        {/*CSV Export button.*/}
                        <CSVLink
                            style={{padding: "7px"}}
                            className="filter-btn" data={props.appState.sheet.getRawMatrixData()}
                            filename={"nu-cell-data.csv"}><FontAwesomeIcon icon={faDownload}/>
                        </CSVLink>
                        {/*Opens the filter modal.*/}
                        <Button
                            className="filter-btn"
                            disabled={invalidCoordinate || cellIsEmpty}
                            onClick={() => props.showFilterModal(true)} variant={"primary"}>
                            <FontAwesomeIcon icon={faFilter}/>
                        </Button>
                        {/*Dropdown for the color selector.*/}
                        <NavDropdown
                            className="nav-btn"
                            disabled={invalidCoordinate}
                            title={<FontAwesomeIcon icon={faPalette}/>}>
                            <NavDropdown.ItemText style={{textAlign: "center"}}>
                                Choosing color for: {props.appState.selectedCell}
                            </NavDropdown.ItemText>
                            <NavDropdown.Divider/>
                            <NavDropdown.ItemText>
                                <HexColorPicker onChange={changeCellColor}/>
                            </NavDropdown.ItemText>
                        </NavDropdown>
                        {/*Button to clear the currently selected cell.*/}
                        <Button
                            className="nav-btn spacer"
                            variant={"dark"}
                            disabled={invalidCoordinate}
                            onClick={clearCell}>Clear Cell
                        </Button>
                        {/*Button to add a column at the currently selected cell.*/}
                        <Button
                            className="nav-btn"
                            variant={"dark"}
                            disabled={invalidCoordinate}
                            onClick={addColumn}>Add Column
                        </Button>
                        {/*Button to remove a column at the currently selected cell.*/}
                        <Button
                            className="nav-btn"
                            variant={"dark"}
                            disabled={invalidCoordinate || notEnoughColumns}
                            onClick={deleteColumn}>Delete Column
                        </Button>
                        {/*Button to add a row at the currently selected cell.*/}
                        <Button
                            className="nav-btn"
                            variant={"dark"}
                            disabled={invalidCoordinate}
                            onClick={addRow}>Add Row
                        </Button>
                        {/*Button to remove a row at the currently selected cell.*/}
                        <Button
                            className="nav-btn"
                            variant={"dark"}
                            disabled={invalidCoordinate || notEnoughRows}
                            onClick={deleteRow}>Delete Row
                        </Button>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    );
}
