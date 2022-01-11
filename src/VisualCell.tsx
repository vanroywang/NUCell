import {useEffect, useReducer} from "react";
import Utils from "./backend/Util";

export function VisualCell(props: any) {
    // What we set as the initial state of the reducer.
    const initialState = {
        cell: props.cell,
        value: props.cell.getCellEvaluatedContent(),
        currentlySelected: false,
        color: props.cell.getColor(),
        id: props.rowIndex + "-" + props.columnIndex,
        readableId: Utils.numToLetters(props.columnIndex) + (props.rowIndex + 1)
    };

    /**
     * The function that runs when "dispatch()" is called. Controls how the reducer changes its values.
     * @param state: The current state of the reducer with all its current values.
     * @param action: The action the user has initiated to modify the reducer state.
     */
    const reducer = (state: any, action: { type: any; payload: any; }) => {
        switch(action.type) {
            case "cell":
                return { ...state, cell: action.payload };
            case "selected":
                return { ...state, currentlySelected: action.payload };
            case "value":
                if (state.currentlySelected)
                    props.appDispatch({type: "formulaBarContent", payload: action.payload});
                return { ...state, value: action.payload };
            default:
                throw new Error();
        }
    };

    // Initialization of the reducer.
    const [state, dispatch] = useReducer(reducer, initialState);

    // If the globally selected cell changed, check if this is the cell that should be modified.
    useEffect(() => dispatch({type: "selected", payload: props.appState.selectedCell === state.readableId}),
        [props.appState.selectedCell]);

    /** If this cell's state value changed it means one of two things:
     * - It wasn't selected and became selected.
     * - It was selected and was deselected.
     * Those two cases are covered by the if/else statement below.
     */
    useEffect(() => {
        if (state.currentlySelected) {
            props.appDispatch({type: "formulaBarContent", payload: state.value});
            dispatch({type: "value", payload: state.cell.getRawContent()});
        } else {
            props.appState.sheet.changeCellContent(state.value, props.rowIndex, props.columnIndex);
            const content = state.cell.getCellEvaluatedContent();

            if (content.toLowerCase().includes("error")) {
                props.appDispatch({type: "error", payload: content});
            }

            dispatch({type: "value", payload: content});
        }
    }, [state.currentlySelected]);

    // If the enter key is pressed while typing in a cell, the cell will be deselected.
    const enterHandler = (key: string) => {
        if (key === 'Enter') {
            dispatch({type: "selected", payload: false});
            props.appDispatch({type: "selectedCoordinate", payload: [-1, -1]});
            props.appDispatch({type: "formulaBarContent", payload: ""});
        }
    };

    // If the prop cell changes (as happens when columns and rows are added/removed), then we should update
    // the cell watched in the state to mirror that.
    useEffect(() => dispatch({type: "cell", payload: props.cell}),
        [props.cell]);

    // If the value of the stored cell changes at any point, update its displayed value to match what the cell
    // should be showing. Also throw an error if that new content contains an error.
    useEffect(() => {
            const content = state.cell.getCellEvaluatedContent();

            if (content.toLowerCase().includes("error")) {
                props.appDispatch({type: "error", payload: content});
            }

            dispatch({type: "value", payload: content})
        },
        [state.cell, state.cell.evaluatedContent, state.cell.content]);

    return (
        /**
         * The outer cell element. While the cell is selected, it becomes fixed in place so that we can
         * scale its size to match the text inside it without moving every other cell in the process.
         * it also increases its z-index to make sure it appears on top of the other cells.
         */
        <td style={{
            position: state.currentlySelected ? "absolute" : "relative",
            zIndex: state.currentlySelected ? 2 : 1,
        }}>
            {/*The input where user types the content of the cell.*/}
            <input
                readOnly={!state.currentlySelected}
                style={{
                    // This (roughly) scales the width of the input to match the number of characters typed.
                    width: state.currentlySelected ? Math.max(100, state.value.length * 8) + "px" : "100px",
                    zIndex: state.currentlySelected ? 2 : 1,
                    backgroundColor: state.cell.color
                }}
                key={state.id}
                value={state.value}
                onChange={event => dispatch({type: "value", payload: event.target.value})}
                onKeyPress={event => enterHandler(event.key)}
                onClick={() => props.appDispatch({
                    type: "selectedCoordinate",
                    payload: [props.rowIndex, props.columnIndex]
                })}/>
        </td>
    );
}
