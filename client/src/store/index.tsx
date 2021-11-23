import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth";
import modal from './modal';
import restaurant from "./restaurant";
import cart from "./cart";
import checkout from "./checkout";

const store = configureStore({
    reducer: {
        auth,
        modal,
        restaurant,
        cart,
        checkout
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;