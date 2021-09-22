import { configureStore } from "@reduxjs/toolkit";

import auth from "./auth";
import modal from './modal';

const store = configureStore({
    reducer: {
        auth,
        modal
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;