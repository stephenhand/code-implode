import {repositoryPickerSlice, RepositoryPickerState} from "./repository-locator/repository-picker-state";
import {configureStore} from "@reduxjs/toolkit";

export type RootState = {
    repositoryPicker: RepositoryPickerState
}


export let store = configureStore<RootState>({
    reducer: {
        repositoryPicker: repositoryPickerSlice.reducer
    }
})