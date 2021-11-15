import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth";
import modal from './modal';
import restaurant from "./restaurant";

const store = configureStore({
    reducer: {
        auth,
        modal,
        restaurant
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;