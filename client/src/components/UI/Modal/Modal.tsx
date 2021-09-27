import React from 'react';
import ReactDOM from 'react-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { modalActions } from '../../../store/modal';
import LoginModal from '../../auth/Login/LoginModal';
import RegisterModal from '../../auth/Register/RegisterModal';

import classes from './Modal.module.css';

const Backdrop: React.FC = () => {
    const dispatch = useAppDispatch();
    const closeModal = () => {
        dispatch(modalActions.close())
    }
    return <div className={classes.backdrop} onClick={closeModal}></div>;
}

let ModalOverlay: React.FC = () => {
    return <div></div>;
};

const modals: { [key: string]: React.FC } = {
    'login': LoginModal,
    'register': RegisterModal
}

const Modal: React.FC = () => {
    const overlayName = useAppSelector(state => state.modal.overlayName);
    const IncomingModal: React.FC = modals[overlayName];
    ModalOverlay = () => <div className={classes.modal}><IncomingModal /></div>;

    return (
        <>
            <React.Fragment>
                {ReactDOM.createPortal(
                    <Backdrop />,
                    document.getElementById('backdrop-root')!
                )}
                {ReactDOM.createPortal(
                    <ModalOverlay />,
                    document.getElementById('overlay-root')!
                )}
            </React.Fragment>
        </>
    );
};

export default Modal;