import { createSlice } from "@reduxjs/toolkit";


export const initialAppState = {
    isInitializing: true
}

const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        initDone(state) {
            state.isInitializing = false;
        },
    }
});

export const appActions = appSlice.actions;

export default appSlice.reducer;