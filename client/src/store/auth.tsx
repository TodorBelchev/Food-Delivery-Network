import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IAuthState from "../interfaces/IAuthState";
import IUser from "../interfaces/IUser";

const initialState: IAuthState = {
    email: null,
    isAdmin: false,
    _id: null,
    favorites: []
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
            state._id = null;
            state.isAdmin = false;
        },
        addToFavorites(state, action: PayloadAction<{ _id: string }>) {
            state.favorites.push(action.payload._id);
            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },
        removeFromFavorites(state, action: PayloadAction<{ _id: string }>) {
            const index = state.favorites.indexOf(action.payload._id);
            state.favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(state.favorites));
        },
        autoLoadFavorites(state) {
            const favorites = localStorage.getItem('favorites');
            if (favorites) {
                state.favorites = JSON.parse(favorites);
            }
        }
    }
});

export const authActions = authSlice.actions;

export default authSlice.reducer;