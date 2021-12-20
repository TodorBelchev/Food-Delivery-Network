import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import INotification from "../interfaces/INotification";

export const initialNotificationState: INotification = {
    type: '',
    text: ''
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: initialNotificationState,
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