import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModalState } from "../interfaces/IModalState";



export const initialModalState: IModalState = {
    isOpen: false,
    overlayName: ''
}

const modalSlice = createSlice({
    name: 'modal',
    initialState: initialModalState,
    reducers: {
        open(state, action: PayloadAction<string>) {
            state.isOpen = true;
            state.overlayName = action.payload;
        },
        close(state) {
            state.isOpen = false;
            state.overlayName = '';
        },
        changeOverlay(state, action: PayloadAction<string>) {
            state.overlayName = action.payload;
        }
    }
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;