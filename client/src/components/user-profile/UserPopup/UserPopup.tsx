import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import { authActions } from '../../../store/auth';

import classes from './UserPopup.module.css';

type UserPopupProps = JSX.IntrinsicElements['div'] & {
    onClosePopup: (e: React.MouseEvent) => void;
}

const UserPopup: React.FC<UserPopupProps> = (props) => {
    const user = useAppSelector(state => state.auth);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const logoutHandler = (e: React.MouseEvent) => {
        props.onClosePopup(e);
        // clear credentials
        dispatch(authActions.logout());
        history.push('/');
    }
    return (
        <div className={classes.popup}>
            <div className={classes.inner}>
                <NavLink to={`/profile/${user._id}`} className={classes.link} onClick={props.onClosePopup}>Profile</NavLink>
                <NavLink to={`/profile/${user._id}/orders`} className={classes.link} onClick={props.onClosePopup}>Orders</NavLink>
                <NavLink to={`/profile/${user._id}/favorites`} className={classes.link} onClick={props.onClosePopup}>Favorites</NavLink>
                <button className={classes.btn} onClick={logoutHandler}>Sign out</button>
            </div>
        </div>
    )
}

export default UserPopup;