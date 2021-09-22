import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IModalState } from "../interfaces/IModalState";



const initialState: IModalState = {
    isOpen: false,
    overlayName: ''
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        open(state, action: PayloadAction<string>) {
            state.isOpen = true;
            state.overlayName = action.payload;
        },
        close(state) {
            state.isOpen = false;
            state.overlayName = '';
        }
    }
});

export const modalActions = modalSlice.actions;

export default modalSlice.reducer;