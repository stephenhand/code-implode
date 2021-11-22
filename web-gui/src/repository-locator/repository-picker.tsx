import React, { ChangeEvent } from "react";
import {useDispatch, useSelector} from "react-redux";
import {RepositoryPickerState, repoUrlChanged, selectRepositoryPicker} from "./repository-picker-state";


export const RepositoryPicker = ()=> {
    const dispatch = useDispatch();
    const state: RepositoryPickerState = useSelector(selectRepositoryPicker);
    return <div>
        <input type={"text"} onChange={(evt: ChangeEvent<HTMLInputElement>)=> dispatch(repoUrlChanged(evt.target.value))} value={state.repoUrl}/>
        <div id={"status"}>Ch ch ch ch changes: {state.statusText}</div>
    </div>
}