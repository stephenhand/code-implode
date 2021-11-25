import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {put, takeLatest, call, delay } from "redux-saga/effects";
import {RootState} from "../store";
import {isHttpError, isNetworkError} from "../http-error";
import {
    CheckRepoRequestOutcome,
    checkRepoUrl,
    isRepoNotFoundError
} from "./repository-client";

export type RepositoryPickerState = {
    repoUrl: string,
    statusHeading: string,
    statusText: string
};

export enum ReducerlessAction {
    REPO_URL_CHANGING = "REPO_URL_CHANGING"
}

export const repositoryPickerSlice = createSlice({
    name: "repositoryPicker",
    initialState: {
        repoUrl: "http://github.com/",
        statusHeading: "-",
        statusText: ""
    },
    reducers: {
        repoUrlChanged: (state: Draft<RepositoryPickerState>, updatedRepoUrl: PayloadAction<string>) => {
            state.repoUrl = updatedRepoUrl.payload;
        },
        repoUrlLookedUp: (state: Draft<RepositoryPickerState>, status: PayloadAction<CheckRepoRequestOutcome>) => {
            const result = status.payload;
            state.statusText = ""
            if (isNetworkError(result)) {
                state.statusHeading = `A network error occurred trying to contact repo.`;
                state.statusText = result.message;
                console.error(result);
            } else if (isHttpError(result)) {
                state.statusHeading = `The repo responded with an error (status code ${result.status})`;
                state.statusText = result.message;
                console.error(result);
            } else if (isRepoNotFoundError(result)) {
                state.statusHeading = `Repo not found`;
                state.statusText = result.message;
            } else {
                state.statusHeading = `'${result.title}' by ${result.owner}`;
                state.statusText = result.description
                console.log("Repo external info", result);
            }
        },
        repoUrlInvalid: (state: Draft<RepositoryPickerState>, status: PayloadAction<TypeError>) => {
            const result = status.payload;
            state.statusText = "";
            state.statusHeading = `Enter a valid URL.`
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
    yield delay(500);
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