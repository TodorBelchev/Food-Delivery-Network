import React from "react";
import ReactDOM from 'react-dom';

import { useAppDispatch } from "../../../hooks/redux-hooks";
import { modalActions } from "../../../store/modal";

import classes from './Modal.module.css';

export const Backdrop: React.FC = () => {
    const dispatch = useAppDispatch();
    const closeModal = () => {
        dispatch(modalActions.close())
    }
    return <div className={classes.backdrop} onClick={closeModal}></div>;
}

const Modal: React.FC = (props) => {
    return (
        <>
            {ReactDOM.createPortal(
                <Backdrop />,
                document.getElementById('backdrop-root')!
            )}
            {ReactDOM.createPortal(
                <div className={classes.modal}>
                    {props.children}
                </div>,
                document.getElementById('overlay-root')!
            )}
        </>
    );
}

export default Modal;