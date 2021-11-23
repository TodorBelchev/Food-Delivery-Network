import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import ICheckout from "../interfaces/ICheckout";

const initialState: ICheckout = {
    phone: null,
    name: null,
    city: null,
    address: null,
}

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        save(state, action: PayloadAction<ICheckout>) {
            state.phone = action.payload.phone;
            state.name = action.payload.name;
            state.city = action.payload.city;
            state.address = action.payload.address;
        }
    }
});

export const checkoutActions = checkoutSlice.actions;

export default checkoutSlice.reducer;