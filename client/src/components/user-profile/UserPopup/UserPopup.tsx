import React, { useCallback } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/redux-hooks';
import useHttp from '../../../hooks/use-http';
import { authActions } from '../../../store/auth';

import classes from './UserPopup.module.css';


const UserPopup: React.FC = () => {
    const user = useAppSelector(state => state.auth);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { sendRequest } = useHttp();

    const resHandler = useCallback(() => null, []);

    const logoutHandler = useCallback((e: React.MouseEvent) => {
        sendRequest({ url: 'http://localhost:3030/api/user/logout' }, resHandler);
        dispatch(authActions.logout());
        history.push('/');
    }, [dispatch, history, sendRequest, resHandler]);


    return (
        <div className={classes.popup}>
            <div className={classes.inner}>
                <NavLink to={`/profile/${user._id}`} className={classes.link}>Profile</NavLink>
                <NavLink to={`/profile/${user._id}/orders`} className={classes.link}>Orders</NavLink>
                <NavLink to={`/profile/${user._id}/favorites`} className={classes.link}>Favorites</NavLink>
                <button className={classes.btn} onClick={logoutHandler}>Sign out</button>
            </div>
        </div>
    )
}

export default UserPopup;