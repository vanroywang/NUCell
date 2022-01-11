import React, {useReducer, useState} from 'react';
import './App.css';
import {Table} from "./Table";
import {Button, Modal, FormCheck, Form, FormGroup} from "react-bootstrap";
import {Sheet} from "./backend/Sheet";
import {NavBar} from "./NavBar";
import Utils from "./backend/Util";

export default function App() {
    // Variables representing the initial draw size of our table.
    const TABLE_WIDTH = 30;
    const TABLE_HEIGHT = 30;

    // For whatever reason, when this variable is stored in the reducer, it doesn't show and hide the modal properly,
    // so I have kept it in its own state here.
    const [filterModalShow, setFilterModalShow] = useState(false);
    const [errorModalShow, setErrorModalShow] = useState(false);

    // What we set as the initial state of the reducer.
    const initialState = {
        // The sheet class object, we connect to the backend entirely through this.
        sheet: new Sheet(TABLE_WIDTH, TABLE_HEIGHT),

        // The number of columns that are currently in the table.
        numColumns: TABLE_WIDTH,

        // The number of rows that are currently in the table.
        numRows: TABLE_HEIGHT,

        // The coordinate of the cell that is currently selected in row, column order
        // (i.e. A1 would be [0,0], B1 = [0,1], C2 = [1,2], etc.)
        selectedCoordinate: [-1, -1],

        // The literal name of the cell (i.e. A1, B2, C2, etc.).
        // This is also what's displayed in the cell to the left of the formula bar.
        selectedCell: "",

        // The text displayed in the formula bar.
        formulaBarContent: "",

        // The string values of the cells that should be hidden by the filter.
        hiddenValues: [],

        // The indexes of each row that should be hidden based off the strings in hiddenValues.
        hiddenRows: [],

        errorMessage: "",
    };

    /**
     * The function that runs when "dispatch()" is called. Controls how the reducer changes its values.
     * @param state: The current state of the reducer with all its current values.
     * @param action: The action the user has initiated to modify the reducer state.
     */
    const reducer = (state: any, action: {type: any, payload?: any}) => {
        switch (action.type) {
            // Modify the number of columns from the table that should be displayed.
            // Note that this doesn't actually change the number of columns in the sheet object, just up to what index
            // number we should be displaying.
            case "numColumns":
                return {...state, numColumns: action.payload};

            // Modify the number of rows from the table that should be displayed.
            // Note that this doesn't actually change the number of rows in the sheet object, just up to what index
            // number we should be displaying.
            case "numRows":
                return {...state, numRows: action.payload};

            // Modify which cell is currently being treated as "selected" by inputting its coordinate here.
            case "selectedCoordinate":
                return {
                    ...state,
                    selectedCoordinate: action.payload,
                    formulaBarContent: action.payload.includes(-1) ? "" : state.formulaBarContent,
                    selectedCell: action.payload.includes(-1) ? "" :
                        Utils.numToLetters(action.payload[1]) + (action.payload[0] + 1)
                };

            // Modify what text is displayed in the formula bar.
            case "formulaBarContent":
                return {...state, formulaBarContent: action.payload};

            // Modify which strings should be in the list of strings to apply when the applyFilter function is called.
            case "hiddenValues":
                return {...state, hiddenValues: action.payload};

            // Modify the row indexes that are currently being hidden by the program.
            case "hiddenRows":
                return {...state, hiddenRows: action.payload};

            // Modify the error message to be displayed in the error modal.
            case "error":
                setErrorModalShow(true);
                return {...state, errorMessage: action.payload};

            // Any other case is not supported and should arrive here.
            default:
                throw new Error("Unsupported action type.");
        }
    }
    // Initialization of the reducer.
    const [state, dispatch] = useReducer(reducer, initialState);

    /**
     * Uses the strings that should be hidden listen in hiddenValues to populate which rows
     * should be hidden in hiddenRows.
     */
    const applyFilter = () => {
        let newHiddenRows: number[] = [];

        for (let stringToFilter of state.hiddenValues) {
            newHiddenRows = newHiddenRows.concat(
                state.sheet.filterColumn(stringToFilter, state.selectedCoordinate[0], state.selectedCoordinate[1]));
        }

        dispatch({type: "hiddenRows", payload: newHiddenRows});
    };

    return (
        <div className="App">
            {/*The Navbar of the program.*/}
            <NavBar appState={state} appDispatch={dispatch} showFilterModal={setFilterModalShow}/>

            {/*Spacer Div to make up for the fixed navbar.*/}
            <div className="navbar-spacer"/>

            {/*Formula bar elements.*/}
            <div>
                <input className="selected-cell-display" readOnly value={state.selectedCell}/>
                <input className="formula-bar" readOnly value={state.formulaBarContent}/>
            </div>

            {/*Spacer to make up for the fixed formula bar.*/}
            <div className="formula-bar-spacer"/>

            <Table appState={state} appDispatch={dispatch}/>

            <Modal show={filterModalShow} onHide={() => setFilterModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Filtering: {state.selectedCell}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <FormGroup>
                            {!filterModalShow ? null : Array.from<string>(
                                state.sheet.getFilterList(state.selectedCoordinate[0], state.selectedCoordinate[1]))
                                .map((cellData, columnIndex) => (
                                <div>
                                    <FormCheck
                                        type="checkbox"
                                        label={cellData}
                                        checked={!state.hiddenValues.includes(cellData)}
                                        onChange={() => {
                                            if (state.hiddenValues.includes(cellData))
                                                dispatch({
                                                    type: "hiddenValues",
                                                    payload: state.hiddenValues.filter((e: string) => e !== cellData)
                                                });
                                            else
                                                dispatch({
                                                    type: "hiddenValues",
                                                    payload: state.hiddenValues.concat([cellData])
                                                });
                                        }}/>
                                </div>
                            ))}
                        </FormGroup>
                        <Button
                            variant={"danger"}
                            onClick={() => {
                                dispatch({type: "hiddenValues", payload: []});
                                dispatch({type: "hiddenRows", payload: []});
                                setFilterModalShow(false);
                            }}>Clear Filter</Button>
                        <Button
                            variant={"dark"}
                            onClick={applyFilter}>Apply Filter</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={errorModalShow} onHide={() => setErrorModalShow(false)}>
                <Modal.Body style={{textAlign: "center"}}>
                    {state.errorMessage}
                </Modal.Body>
            </Modal>
        </div>
    );
}
