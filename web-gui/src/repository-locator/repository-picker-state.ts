import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";

export type RepositoryPickerState = {
    repoUrl: string
    statusText: string
};

export const repositoryPickerSlice = createSlice({
    name: "repositoryPicker",
    initialState: {
        repoUrl: "github.com/",
        statusText: "-"
    },
    reducers: {
        repoUrlChanged: (state, updatedRepoUrl: PayloadAction<string>) => {
            state.repoUrl = updatedRepoUrl.payload;
            state.statusText = updatedRepoUrl.payload.length.toString();
        }
    }
});

export const { repoUrlChanged } = repositoryPickerSlice.actions;

export function selectRepositoryPicker(store: RootState): RepositoryPickerState {
    return store.repositoryPicker;
}