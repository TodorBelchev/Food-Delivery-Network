import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import IRestaurant from "../interfaces/IRestaurant";

const initialState: IRestaurant = {
    _id: '',
    categories: [],
    cities: [],
    image: {
        url: '',
        object_id: ''
    },
    mainTheme: '',
    name: '',
    owner: '',
    workDays: [],
    workHours: [],
    rating: 0,
    ratingsCount: 0,
    recipes: []
};

const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRestaurant(state, action: PayloadAction<IRestaurant>) {
            state._id = action.payload._id;
            state.categories = action.payload.categories;
            state.cities = action.payload.cities;
            state.image = action.payload.image;
            state.mainTheme = action.payload.mainTheme;
            state.name = action.payload.name;
            state.owner = action.payload.owner;
            state.workDays = action.payload.workDays;
            state.workHours = action.payload.workHours;
            state.rating = action.payload.rating;
            state.ratingsCount = action.payload.ratingsCount;
            state.recipes = action.payload.recipes;
        },
        clearRestaurant(state) {
            state._id = '';
            state.categories = [];
            state.cities = [];
            state.image = { url: '', object_id: '' };
            state.mainTheme = '';
            state.name = '';
            state.owner = '';
            state.workDays = [];
            state.workHours = [];
            state.rating = 0;
            state.ratingsCount = 0;
            state.recipes = [];
        }
    }
});

export const restaurantActions = restaurantSlice.actions;

export default restaurantSlice.reducer;