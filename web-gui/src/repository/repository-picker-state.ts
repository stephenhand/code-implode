import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {put, takeLatest, call } from "redux-saga/effects";
import {RootState} from "../store";
import {isHttpError, isNetworkError} from "../http-error";
import {
    CheckRepoRequestOutcome,
    checkRepoUrl,
    isRepoNotFoundError
} from "./repository-client";

export type RepositoryPickerState = {
    repoUrl: string
    statusText: string
};

export enum ReducerlessAction {
    REPO_URL_CHANGING = "REPO_URL_CHANGING"
}

export const repositoryPickerSlice = createSlice({
    name: "repositoryPicker",
    initialState: {
        repoUrl: "http://github.com/",
        statusText: "-"
    },
    reducers: {
        repoUrlChanged: (state: Draft<RepositoryPickerState>, updatedRepoUrl: PayloadAction<string>) => {
            state.repoUrl = updatedRepoUrl.payload;
        },
        repoUrlLookedUp: (state: Draft<RepositoryPickerState>, status: PayloadAction<CheckRepoRequestOutcome>) => {
            const result = status.payload;
            if (isNetworkError(result)) {
                state.statusText = `A network error occurred trying to contact repo.`;
                console.error(result);
            } else if (isHttpError(result)) {
                state.statusText = `The repo responded with an error (status code ${result.status}: ${result.message}}`;
                console.error(result);
            } else if (isRepoNotFoundError(result)) {
                state.statusText = `Repo not found: ${result.message}}`;
            } else {
                state.statusText = `Shouldn't be here, no service endpoint exists yet! ${JSON.stringify(result)}}`;
                console.log("Repo external info", result);
            }
        },
        repoUrlInvalid: (state: Draft<RepositoryPickerState>, status: PayloadAction<TypeError>) => {
            const result = status.payload;
            state.statusText = `Enter a valid URL.`
            console.log("Invalid URL", result.name, result.message, result.stack)
        }
    }
});

export const { repoUrlChanged, repoUrlLookedUp, repoUrlInvalid } = repositoryPickerSlice.actions;

export function selectRepositoryPicker(store: RootState): RepositoryPickerState {
    return store.repositoryPicker;
}

function* lookupRepo(action: PayloadAction<string>) {
    yield put({ type:repoUrlChanged.toString(), payload: action.payload });
    let validUrl:URL | null = null;
    try {
        validUrl = new URL(action.payload);
    } catch (error) {
        yield put({ type:repoUrlInvalid.toString(), payload: error });
    }
    if (validUrl) {
        const checkResponse: CheckRepoRequestOutcome = yield call(checkRepoUrl, validUrl);
        yield put({ type:repoUrlLookedUp.toString(), payload: checkResponse })
    }
}

export function* watchLookupRepo() {
    yield takeLatest(ReducerlessAction.REPO_URL_CHANGING, lookupRepo);
}