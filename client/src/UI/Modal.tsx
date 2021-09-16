import React from 'react';
import ReactDOM from 'react-dom';

import { ILoginModalProps } from '../interfaces/ILoginModal';
import classes from './Modal.module.css';

const Backdrop: React.FC<ILoginModalProps> = (props) => {
    return <div className={classes.backdrop} onClick={props.onBackdropClick}/>;
}

let ModalOverlay: React.FC = () => {
    return <div></div>;
};

const Modal: React.FC<ILoginModalProps> = (props) => {
    ModalOverlay = props.overlay!;
    
    return (
        <>
            <React.Fragment>
                {ReactDOM.createPortal(
                    <Backdrop onBackdropClick={props.onBackdropClick}/>,
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