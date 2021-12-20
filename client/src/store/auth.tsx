import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IAuthState from "../interfaces/IAuthState";

export const initialAuthState: IAuthState = {
    email: null,
    isAdmin: false,
    _id: null,
    phone: null,
    firstName: null,
    lastName: null,
    city: null,
    address: null,
    favorites: []
}

const authSlice = createSlice({
    name: 'auth',
    initialState: initialAuthState,
    reducers: {
        login(state, action: PayloadAction<IAuthState>) {
            state.email = action.payload.email;
            state._id = action.payload._id;
            state.isAdmin = action.payload.isAdmin;
            state.firstName = action.payload.firstName;
            state.lastName = action.payload.lastName;
            state.phone = action.payload.phone;
            state.city = action.payload.city;
            state.address = action.payload.address;
        },
        logout(state) {
            state.email = null;
            state._id = null;
            state.isAdmin = false;
            state.phone = null;
            state.firstName = null;
            state.lastName = null;
            state.city = null;
            state.address = null;
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