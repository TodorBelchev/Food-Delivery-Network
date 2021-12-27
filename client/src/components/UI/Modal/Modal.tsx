import React, { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';

import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { modalActions } from "../../../store/modal";

import { Transition } from "react-transition-group";


import classes from './Modal.module.css';


type BackdropProps = JSX.IntrinsicElements['div'] & {
    closeHandler: () => void;
}

export const Backdrop: React.FC<BackdropProps> = ({ closeHandler }) => {
    return <div className={classes.backdrop} onClick={closeHandler}></div>;
}

const Modal: React.FC = ({ children }) => {
    const [show, setShow] = useState(false);
    const nodeRef = useRef(null);
    const dispatch = useAppDispatch();
    const modalState = useAppSelector(state => state.modal);


    useEffect(() => {
        if (modalState.isOpen) {
            setShow(true);
        }
    }, [modalState.isOpen]);

    const closeHandler = () => {
        setShow(false);
        setTimeout(() => {
            dispatch(modalActions.close());
        }, 300);
    }

    return (
        <>
            {!modalState.isOpen && null}
            {modalState.isOpen && <Transition timeout={300} in={show} mountOnEnter nodeRef={nodeRef}>
                {state => {
                    let modalClasses = '';

                    if (state === 'entering' || state === 'entered') {
                        modalClasses = `${classes.entering}`;
                    }

                    if (state === 'exiting' || state === 'exited') {
                        modalClasses = `${classes.exiting}`;
                    }

                    return (
                        <>
                            {state === 'exited' ?
                                null :
                                ReactDOM.createPortal(
                                    <Backdrop closeHandler={closeHandler} />,
                                    document.getElementById('backdrop-root')! || document.createElement('div') // for testing
                                )}
                            {ReactDOM.createPortal(
                                <div className={`${classes.modal} ${modalClasses}`}>
                                    {children}
                                </div>,
                                document.getElementById('overlay-root')! || document.createElement('div') // for testing
                            )}
                        </>
                    )
                }}
            </Transition>}
        </>
    );
}

export default Modal;