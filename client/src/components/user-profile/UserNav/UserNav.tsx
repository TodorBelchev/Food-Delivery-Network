import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import IAuthState from '../../../interfaces/IAuthState';

import classes from './UserNav.module.css';

type UserNavProps = JSX.IntrinsicElements['nav'] & {
    user: IAuthState
}

const UserNav: React.FC<UserNavProps> = ({ user }) => {
    const [scroll, setScroll] = useState(0);

    const handleScroll = useCallback((e: Event) => {
        const window = e.currentTarget as Window;
        setScroll(window.scrollY);
    }, []);

    useEffect(() => {
        setScroll(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll])
    return (
        <nav className={`${classes.nav} ${scroll > 0 ? classes['nav--scrolled'] : ''}`}>
            <ul className={`container ${classes.list}`}>
                <li>
                    <NavLink activeClassName={classes.active} className={classes['list-item']} to={`/profile/${user._id}`} exact>Profile</NavLink>
                </li>
                <li>
                    <NavLink activeClassName={classes.active} className={classes['list-item']} to={`/profile/${user._id}/create-restaurant`}>Create Restaurant</NavLink>
                </li>
                <li>
                    <NavLink activeClassName={classes.active} className={classes['list-item']} to={`/profile/${user._id}/favorites`}>Favorite restaurants</NavLink>
                </li>
                <li>
                    <NavLink activeClassName={classes.active} className={classes['list-item']} to={`/profile/${user._id}/orders`}>Orders</NavLink>
                </li>
            </ul>
        </nav>
    )
};

export default UserNav;