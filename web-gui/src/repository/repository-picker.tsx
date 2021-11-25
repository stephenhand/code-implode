import React, { ChangeEvent } from "react";
import {useDispatch, useSelector} from "react-redux";
import {RepositoryPickerState, ReducerlessAction, selectRepositoryPicker} from "./repository-picker-state";


export const RepositoryPicker = ()=> {
    const dispatch = useDispatch();
    const state: RepositoryPickerState = useSelector(selectRepositoryPicker);
    return <div>
        <input style={{ width: "400px" }} type={"text"} onChange={(evt: ChangeEvent<HTMLInputElement>)=> dispatch({ type:ReducerlessAction.REPO_URL_CHANGING, payload:evt.target.value})} value={state.repoUrl}/>
        <div id={"status-heading"}>{state.statusHeading}</div><div id={"status-text"}>{state.statusText}</div>
    </div>
}