import React, { useEffect, useRef, useState } from "react";

import UserPopup from "../UserPopup/UserPopup";

import classes from './UserIcon.module.css';

const UserIcon: React.FC = () => {
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleOutsideClick = (e: MouseEvent) => {
        if (!containerRef.current?.contains(e.target as Node)) {
            setPopupIsOpen(false);
        }
    }

    const handleInsideClick = (e: React.MouseEvent) => {
        if ((e.target as Node) === imgRef.current) {
            setPopupIsOpen(oldState => !oldState);
        } else if((e.target as Node).nodeName === 'A' || (e.target as Node).nodeName === 'BUTTON') {
            setPopupIsOpen(false);
        } else {
            setPopupIsOpen(true);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className={classes.container} ref={containerRef} onClick={handleInsideClick}>
            <img className={classes['user-icon']} ref={imgRef} src="/icons/user-icon.svg" alt="user icon" />
            {popupIsOpen && <UserPopup onClosePopup={handleInsideClick}/>}
        </div>
    )
}

export default UserIcon;