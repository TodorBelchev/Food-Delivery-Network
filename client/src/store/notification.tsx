import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import INotification from "../interfaces/INotification";

const initialState: INotification = {
    type: '',
    text: ''
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        show(state, action: PayloadAction<INotification>) {
            state.type = action.payload.type || 'error';
            state.text = action.payload.text || 'Something went wrong. Please try again later.';
        },
        close(state) {
            state.type = '';
            state.text = '';
        }
    }
});

export const notificationActions = notificationSlice.actions;

export default notificationSlice.reducer;