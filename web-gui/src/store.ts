import {repositoryPickerSlice, RepositoryPickerState, watchLookupRepo} from "./repository/repository-picker-state";
import {configureStore, getDefaultMiddleware, Store} from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga"
import {all} from "redux-saga/effects"

export type RootState = {
    repositoryPicker: RepositoryPickerState
}

function* rootSaga() {
    yield all([ watchLookupRepo() ])
}
const sagaMiddleware = createSagaMiddleware();
export let store: Store<RootState> = configureStore({
    middleware: [...getDefaultMiddleware({thunk: false}), sagaMiddleware],
    reducer: {
        repositoryPicker: repositoryPickerSlice.reducer
    }
});

sagaMiddleware.run(rootSaga);
console.log("Saga ready");