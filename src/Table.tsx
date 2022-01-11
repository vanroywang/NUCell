import './Table.css'
import {VisualCell} from "./VisualCell";
import Utils from "./backend/Util";

export function Table(props: any) {
    return (
        <div>
            {/*Create table to store all cells*/}
            <table key="table">
                <tbody>
                    <tr>
                        {/*Column Headers. i.e. the cells that say "A", "B", "C", etc.*/}
                        {[...Array(props.appState.numColumns + 1)].map((_, columnIndex) => (
                            <td>
                                <input className="id-cell"
                                       readOnly
                                       value={Utils.numToLetters(columnIndex - 1)}
                                       key={Utils.numToLetters(columnIndex - 1)}/>
                            </td>
                        ))}
                    </tr>
                    {[...Array(props.appState.numRows)].map((_, rowIndex) => {
                        return props.appState.hiddenRows.includes(rowIndex) ?
                            null : (
                                // Row headers. i.e. the cells that say "1", "2", "3", etc.
                                <tr id={rowIndex.toString()} key={rowIndex}>
                                    <td>
                                        <input className="id-cell" readOnly value={rowIndex + 1} key={rowIndex + 1}/>
                                    </td>

                                    {/*Places the actual cells.*/}
                                    {[...Array(props.appState.numColumns)].map((_, columnIndex) => (
                                        <VisualCell
                                            appState={props.appState}
                                            appDispatch={props.appDispatch}
                                            key={rowIndex + "-" + columnIndex}
                                            cell={props.appState.sheet.getCellAtPosition(rowIndex, columnIndex)}
                                            rowIndex={rowIndex}
                                            columnIndex={columnIndex}/>
                                    ))}
                                </tr>
                            )
                    })}
                </tbody>
            </table>
        </div>
    );
}
