import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import ICartState from "../interfaces/ICartState";
import IRecipe from "../interfaces/IRecipe";


const initialState: ICartState = {
    restaurants: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<{ restaurantId: string; recipe: IRecipe }>) {
            const restaurant = state.restaurants.find(x => x.restaurantId === action.payload.restaurantId);
            if (restaurant) {
                const recipe = restaurant.recipes.find(x => x.recipe._id === action.payload.recipe._id);
                if (recipe) {
                    recipe.quantity++;
                } else {
                    restaurant.recipes.push({ recipe: action.payload.recipe, quantity: 1 });
                }
            } else {
                state.restaurants.push({
                    restaurantId: action.payload.restaurantId,
                    recipes: [{ recipe: action.payload.recipe, quantity: 1 }]
                });
            }
        }
    }
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;