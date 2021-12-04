import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import useHttp from '../../../hooks/useHttp';
import { authActions } from '../../../store/auth';
import { checkoutActions } from '../../../store/checkout';
import userOptions from '../../../utils/userOptions';


import classes from './UserPopup.module.css';


const UserPopup: React.FC = () => {
    const user = useAppSelector(state => state.auth);
    const [isMounted, setIsMounted] = useState(false);
    const history = useHistory();
    const dispatch = useAppDispatch();
    const { sendRequest } = useHttp();

    const resHandler = useCallback(() => null, []);

    const logoutHandler = useCallback(() => {
        sendRequest(userOptions.logout(), resHandler);
        dispatch(authActions.logout());
        dispatch(checkoutActions.clear());
        history.push('/');
    }, [dispatch, history, sendRequest, resHandler]);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    return (
        <div className={classes.popup}>
            <div className={classes.inner}>
                <NavLink to={`/profile/${user._id}`} className={classes.link}>Profile</NavLink>
                <NavLink to={`/profile/${user._id}/orders`} className={classes.link}>Orders</NavLink>
                <NavLink to={`/profile/${user._id}/favorites`} className={classes.link}>Favorites</NavLink>
                {isMounted && <button className={classes.btn} onClick={logoutHandler}>Sign out</button>}
                {!isMounted && <button className={classes.btn}>Sign out</button>}
            </div>
        </div>
    )
}

export default UserPopup;