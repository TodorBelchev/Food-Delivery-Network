import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isInitializing: true
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initDone(state) {
            state.isInitializing = false;
        },
    }
});

export const appActions = appSlice.actions;

export default appSlice.reducer;