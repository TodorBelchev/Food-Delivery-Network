import { createSlice } from "@reduxjs/toolkit";

import IAuthState from "../interfaces/IAuthState";

const initialState: IAuthState = {
    email: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state) {
            state.email = 'pesho';
        },
        logout(state) {
            state.email = null;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;