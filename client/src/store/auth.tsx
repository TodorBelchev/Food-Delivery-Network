import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IAuthState from "../interfaces/IAuthState";
import IUser from "../interfaces/IUser";

const initialState: IAuthState = {
    email: null,
    isAdmin: false,
    _id: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action: PayloadAction<IUser>) {
            state.email = action.payload.email;
            state._id = action.payload._id;
            state.isAdmin = action.payload.isAdmin;
        },
        logout(state) {
            state.email = null;
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;