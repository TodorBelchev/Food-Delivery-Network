import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import ICheckout from "../interfaces/ICheckout";

export const initialCheckoutState: ICheckout = {
    phone: null,
    name: null,
    city: null,
    address: null,
}

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState: initialCheckoutState,
    reducers: {
        save(state, action: PayloadAction<ICheckout>) {
            state.phone = action.payload.phone;
            state.name = action.payload.name;
            state.city = action.payload.city;
            state.address = action.payload.address;
        },
        clear(state) {
            state.phone = null;
            state.name = null;
            state.city = null;
            state.address = null;
        }
    }
});

export const checkoutActions = checkoutSlice.actions;

export default checkoutSlice.reducer;