import React, { useEffect, useRef, useState } from "react";

import UserPopup from "../UserPopup/UserPopup";

import classes from './UserIcon.module.css';

const UserIcon: React.FC = () => {
    const [popupIsOpen, setPopupIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleOutsideClick = (e: MouseEvent) => {
        if (!popupRef.current?.contains(e.target as Node)) {
            setPopupIsOpen(false);
        }
    }

    const handleInsideClick = (e: React.MouseEvent) => {
        if ((e.target as Node) === imgRef.current) {
            setPopupIsOpen(oldState => !oldState);
        } else {
            setPopupIsOpen(true);
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className={classes.container} ref={popupRef} onClick={handleInsideClick}>
            <img className={classes['user-icon']} ref={imgRef} src="/icons/user-icon.svg" alt="user icon" />
            {popupIsOpen && <UserPopup />}
        </div>
    )
}

export default UserIcon;